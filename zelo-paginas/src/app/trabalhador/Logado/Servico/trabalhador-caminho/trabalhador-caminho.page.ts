/// <reference types="google.maps" />
import { Component, OnInit } from '@angular/core';
import { PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';
import { ClearWatchOptions, Geolocation, Position } from '@capacitor/geolocation';
import { apiGoogle, dominio } from 'src/app/gerais';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { Network } from '@capacitor/network';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
    selector: 'app-trabalhador-caminho',
    templateUrl: './trabalhador-caminho.page.html',
    styleUrls: ['./trabalhador-caminho.page.scss'],
})
export class TrabalhadorCaminhoPage implements OnInit {
    msgPoupopCancelar: any = 'Quer realmente cancelar o pedido?';
    msg: any = "Informe o motivo da denúncia";
    mapa: google.maps.Map;
    servicoDirecoes: google.maps.DirectionsService;
    renderizadorDirecoes: google.maps.DirectionsRenderer;
    distancia: any;
    duracao: any;
    endereco: any = localStorage.getItem("endereco")?.replace("\"", "")?.replace("\"", "");
    tempoAtual: any;
    tempoTermino: any;
    ultimaPosicao: google.maps.LatLng;
    watchId: any;
    trabalhador: any = JSON.parse(localStorage.getItem("trabalhador")!);
    destino: google.maps.LatLng;
    cliente: any = JSON.parse(localStorage.getItem("cliente")!);
    carregar: boolean = false;
    marcadorA: google.maps.Marker;
    marcadorB: google.maps.Marker;

    constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private navCl: NavController, private firestore: AngularFirestore) { }

    ngOnInit() {
        PushNotifications.addListener("pushNotificationReceived", (notification: PushNotificationSchema) => {
            let codigo = notification.data.codigo;
            localStorage.setItem("codigo", codigo);
        });
    }

    async ionViewDidEnter() {
        await this.carregarScriptGoogleMaps();
        await this.pegarCoords();

        let data = new Date();
        this.tempoAtual = data.toLocaleTimeString().substring(0, data.toLocaleTimeString().length - 3);

        this.carregarMapa();
    }

    async carregarScriptGoogleMaps(): Promise<void> {
        return new Promise((resolve, reject) => {
            // Verifica se o objeto `google` já está disponível
            if (typeof google !== 'undefined') {
                resolve();
                return;
            }

            // Cria o script para carregar a API do Google Maps
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiGoogle}&libraries=places,marker,geometry`;
            script.async = true;
            script.defer = true;

            // Resolve a promessa quando o script é carregado
            script.onload = () => {
                console.log('Google Maps API carregada.');
                resolve();
            };

            // Rejeita a promessa se houver um erro ao carregar o script
            script.onerror = (error) => {
                console.error('Erro ao carregar o script da API do Google Maps:', error);
                reject(error);
            };

            // Adiciona o script ao documento
            document.head.appendChild(script);
        });
    }

    async carregarMapa() {
        const options: PositionOptions = {
            enableHighAccuracy: true
        };
        const posicao = await Geolocation.getCurrentPosition(options);
        const localizacaoAtual = new google.maps.LatLng(
            posicao.coords.latitude,
            posicao.coords.longitude
        );

        const opcoesMapa: google.maps.MapOptions = {
            mapId: "20efc0a42b57f656",
            center: localizacaoAtual,
            zoom: 12,
            heading: 0,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
        };

        const mapa = document.querySelector("#mapa") as HTMLDivElement;
        this.mapa = new google.maps.Map(mapa, opcoesMapa);

        this.servicoDirecoes = new google.maps.DirectionsService();

        this.renderizadorDirecoes = new google.maps.DirectionsRenderer({
            map: this.mapa,
            suppressMarkers: true
        });

        this.rastrearTempoReal();
    }

    async chamarRoadsAPI(coords: google.maps.LatLng[]) {
        const coordsSnap: google.maps.LatLng[] = [];
        const caminho = coords.map(coord => `${coord.lat()},${coord.lng()}`).join('|');

        const link = `https://roads.googleapis.com/v1/snapToRoads?path=${caminho}&interpolate=true&key=${apiGoogle}`;

        try {
            let res: any = await firstValueFrom(this.http.get(link));
            res.snappedPoints.forEach((ponto: any) => {
                coordsSnap.push(new google.maps.LatLng(ponto.location.latitude, ponto.location.longitude))
            });
        }
        catch {
            console.error("Erro ao pegar as rotas")
        }

        return coordsSnap;
    }

    async pegarCoords() {
        let endereco = localStorage.getItem("endereco");
        let link = `https://maps.googleapis.com/maps/api/geocode/json?address=${endereco}&key=AIzaSyDLQuCu8-clWnemW9ey9s5Hpz2vulxMEzM`;
        let res: any = await firstValueFrom(this.http.get(link));
        let coords = res.results[0].geometry.location;

        this.destino = new google.maps.LatLng(coords.lat, coords.lng);
    }

    abrirChat() {
        this.navCl.navigateForward("/trabalhador/chat");
    }

    async rastrearTempoReal() {
        this.watchId = setInterval(async () => {
            const posicao = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
            const localizacao = new google.maps.LatLng(posicao.coords.latitude, posicao.coords.longitude);
            const status = await Network.getStatus();
            const distanciaDestino = this.calcularDistancia(localizacao, this.destino);
            const coordsSnap = await this.chamarRoadsAPI([localizacao]);
            const precisao = posicao.coords.accuracy;

            if (coordsSnap.length > 0 && precisao <= 30) {
                const localizacaoAjustada = coordsSnap[0];

                if (!this.ultimaPosicao) {
                    this.ultimaPosicao = localizacaoAjustada;

                    let objSnap = {
                        latitude: localizacaoAjustada.lat(),
                        longitude: localizacaoAjustada.lng()
                    };

                    this.firestore.collection("localizacoes").doc(this.trabalhador.Cpf).set(objSnap);
                    this.calcularRota(localizacaoAjustada);
                }
                else {
                    const distancia = this.calcularDistancia(this.ultimaPosicao, localizacaoAjustada);

                    if (distancia >= 3) {
                        let objSnap = {
                            latitude: localizacaoAjustada.lat(),
                            longitude: localizacaoAjustada.lng()
                        };

                        this.firestore.collection("localizacoes").doc(this.trabalhador.Cpf).set(objSnap);
                        this.calcularRota(localizacaoAjustada);
                    }

                    this.ultimaPosicao = localizacaoAjustada;
                }
            }
        }, 500);
    }

    async calcularRota(origem: google.maps.LatLng) {
        let destino: google.maps.LatLng = this.destino;

        const request: google.maps.DirectionsRequest = {
            origin: origem,
            destination: destino,
            travelMode: google.maps.TravelMode.DRIVING,
        };

        this.servicoDirecoes.route(request, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                this.distancia = result?.routes[0].legs[0].distance?.text;
                this.duracao = result?.routes[0].legs[0].duration?.text;

                this.renderizadorDirecoes.setDirections(result);

                const legs = result?.routes[0].legs[0];
                const inicio = legs?.start_location;
                const fim = legs?.end_location;

                if (!this.marcadorA) {
                    this.marcadorA = new google.maps.Marker({
                        map: this.mapa,
                        position: inicio,
                        title: "Origem",
                        icon: {
                            url: "../../../../../assets/icon/Trabalhador/Icone Serviço/seta_trabalhador.svg",
                            scaledSize: new google.maps.Size(30, 30),
                        }
                    });
                } else {
                    this.moverMarcadorSuavemente(this.marcadorA, this.marcadorA.getPosition()!, inicio!, 500);
                }

                if (!this.marcadorB) {
                    this.marcadorB = new google.maps.Marker({
                        map: this.mapa,
                        position: fim,
                        title: "Destino",
                    });
                }

                let distanciaDestino = this.calcularDistancia(origem, this.destino);

                if (distanciaDestino <= 1) {
                    this.marcadorA.setMap(null);
                    this.renderizadorDirecoes.set("directions", null);
                    this.mapa.panTo(this.destino);
                }

                let data = new Date();
                let duracaoMs = result?.routes[0].legs[0].duration?.value! * 1000;
                let dataTermino = new Date(data.getTime() + duracaoMs);
                this.tempoTermino = dataTermino.toLocaleTimeString().substring(0, dataTermino.toLocaleTimeString().length - 3);

                this.cdr.detectChanges();
            }
            else {
                console.error("Erro ao calcular rota: ", status);
            }
        });
    }

    calcularDistancia(pos1: google.maps.LatLng, pos2: google.maps.LatLng): number {
        const R = 6371e3; // Raio da Terra em metros
        const lat1 = pos1.lat() * (Math.PI / 180);
        const lat2 = pos2.lat() * (Math.PI / 180);
        const deltaLat = (pos2.lat() - pos1.lat()) * (Math.PI / 180);
        const deltaLng = (pos2.lng() - pos1.lng()) * (Math.PI / 180);

        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    moverMarcadorSuavemente(marker: google.maps.Marker, inicio: google.maps.LatLng, fim: google.maps.LatLng, duracao: number) {
        const deltaLat = (fim.lat() - inicio.lat()) / duracao;
        const deltaLng = (fim.lng() - inicio.lng()) / duracao;

        let lat = inicio.lat();
        let lng = inicio.lng();
        const intervalo = 10;
        const passos = duracao / intervalo;
        let contador = 0;

        const animacao = setInterval(() => {
            lat += deltaLat * intervalo;
            lng += deltaLng * intervalo;
            const novaPosicao = new google.maps.LatLng(lat, lng);

            let heading = google.maps.geometry.spherical.computeHeading(inicio, fim);

            marker.setPosition(novaPosicao);
            this.mapa.setHeading(heading);
            this.mapa.panTo(novaPosicao);

            contador++;
            if (contador >= passos) {
                clearInterval(animacao);
            }
        }, intervalo);
    }

    mudartxtCancelar() {
        let txtAdvertenciaCancelar = document.querySelector('.txt_cancelar_poupop') as HTMLTextAreaElement;
        let btnProsseguir = document.querySelector("#btnProsseguir") as HTMLIonButtonElement;
        let modalCancelar = document.querySelector("#modal_cancelar") as HTMLIonModalElement;

        txtAdvertenciaCancelar.style.display = "none";

        this.msgPoupopCancelar = 'Pedido cancelado!';

        btnProsseguir.textContent = "Ok";
        btnProsseguir.addEventListener("click", () => {
            this.cancelar();
            modalCancelar.dismiss();
        });
    }

    limpar() {
        this.msg = 'Informe o motivo da denuncia'
        this.msgPoupopCancelar = 'Quer realmente cancelar o pedido?';
    }

    mostrarBtnDenuncia() {
        const btn = document.querySelector(".btn_denunciar") as HTMLIonButtonElement;

        if (btn.style.display == "none") {
            btn.style.display = "block";
        }
        else {
            btn.style.display = "none";
        }
    }

    mudarOutro() {
        const accordion = document.querySelector(".grupo_selecao") as HTMLIonAccordionGroupElement;
        const popup = document.querySelector(".fundoPopup") as HTMLIonTextareaElement;

        accordion.style.display = "none";
        popup.style.display = "block";
    }

    //-----------------------------------------------------------------------------------------------------------//

    mudarOutro2() {
        const accordion = document.querySelector(".grupo_selecao") as HTMLIonAccordionGroupElement;
        const btn = document.querySelector("#btnDenuncia") as HTMLIonButtonElement;
        const modal = document.querySelector("#modal_denuncia") as HTMLIonModalElement;

        accordion.style.display = "none";
        const popup = document.querySelector(".fundoPopup") as HTMLIonTextareaElement;
        popup.style.display = "none";

        this.msg = 'Denúncia enviada com sucesso. Iremos avaliar a sua denúncia.';
        btn.textContent = "Ok";
        btn.addEventListener("click", function () {
            modal.dismiss();
        });
    }

    //-----------------------------------------------------------------------------------------------------------//

    abrirDivCodigo() {

        let div1 = document.querySelector('.div_1') as HTMLDivElement;
        let div2 = document.querySelector('.div_2') as HTMLDivElement;
        let div3 = document.querySelector('.div_3') as HTMLDivElement;
        let div4 = document.querySelector('.div_4') as HTMLDivElement;
        let divCodigo = document.querySelector('.div_codigo') as HTMLAreaElement;

        divCodigo.style.display = 'flex';

        div1.style.display = "none";
        div2.style.display = 'none';
        div3.style.display = 'none';
        div4.style.display = 'none';

    }

    fecharDivCodigo() {

        let div1 = document.querySelector('.div_1') as HTMLDivElement;
        let div2 = document.querySelector('.div_2') as HTMLDivElement;
        let div3 = document.querySelector('.div_3') as HTMLDivElement;
        let div4 = document.querySelector('.div_4') as HTMLDivElement;
        let divCodigo = document.querySelector('.div_codigo') as HTMLAreaElement;

        divCodigo.style.display = 'none';

        div1.style.display = "flex";
        div2.style.display = 'flex';
        div3.style.display = 'flex';
        div4.style.display = 'flex';
    }

    //-----------------------------------------------------------------------------------------------------------//

    verificarCodigo() {

        let div1 = document.querySelector('.div_1') as HTMLDivElement;
        let divCodigo = document.querySelector('.div_codigo') as HTMLAreaElement;
        let divTrabalhoIniciado = document.querySelector('.div_trabalho_iniciado') as HTMLDivElement;
        let divRelogio = document.querySelector('.div_relogio') as HTMLDivElement;

        divRelogio.style.display = 'flex';
        divTrabalhoIniciado.style.display = 'flex';
        divCodigo.style.display = 'none';
        div1.style.display = "flex";
    }

    async cancelar() {
        await Geolocation.clearWatch({ id: this.watchId });

        let link = dominio + "/Trabalhador/CancelarSolicitacao";
        let dadosForm = new FormData();
        dadosForm.append("situacaoServico", "false");
        dadosForm.append("token", this.cliente.TokenFCM);
        dadosForm.append("nmTrabalhador", this.trabalhador.Nome);

        try {
            await firstValueFrom(this.http.post(link, dadosForm));
            localStorage.removeItem("cliente");
            localStorage.removeItem("endereco");
            localStorage.removeItem("solicitacao");
            localStorage.removeItem("confirmacao");
        }
        catch {
            const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
            alert.message = "Erro ao conectar-se ao servidor";
            alert.present();
        }

        this.navCl.navigateRoot("trabalhador/inicial");
    }
}
