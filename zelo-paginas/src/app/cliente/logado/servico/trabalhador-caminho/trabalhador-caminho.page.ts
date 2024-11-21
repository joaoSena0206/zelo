/// <reference types="google.maps" />
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { apiGoogle, dominio } from 'src/app/gerais';
import { HttpClient } from '@angular/common/http';
import { first, firstValueFrom } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';
import { ActionPerformed, PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
    selector: 'app-trabalhador-caminho',
    templateUrl: './trabalhador-caminho.page.html',
    styleUrls: ['./trabalhador-caminho.page.scss'],
})
export class TrabalhadorCaminhoPage implements OnInit {
    msgPoupopCancelar: any = 'Quer realmente cancelar o pedido?';
    msg: any = "Informe o motivo da denúncia";
    trabalhador: any = JSON.parse(localStorage.getItem("trabalhadorEscolhido")!);
    dominio: any = dominio;
    solicitacao: any = JSON.parse(localStorage.getItem("solicitacao")!);
    codigo: any;
    carregar: boolean = false;
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
    destino: google.maps.LatLng;
    cliente: any = JSON.parse(localStorage.getItem("cliente")!);
    marcadorA: google.maps.Marker;
    marcadorB: google.maps.Marker;

    constructor(private navCl: NavController, private http: HttpClient, private firestore: AngularFirestore) { }

    ngOnInit() {
        localStorage.removeItem("idPagamento");
        localStorage.removeItem("tempoPagamento");
        localStorage.removeItem("tempoAtual");

        this.modalCancelar = document.querySelector('#modal_cancelar') as HTMLIonModalElement;

        if (!localStorage.getItem("codigo")) {
            this.gerarCodigo();
        }
        else {
            this.codigo = localStorage.getItem("codigo");
        }

        PushNotifications.addListener("pushNotificationReceived", (notification: PushNotificationSchema) => {
            let situacao = notification.data.situacaoServico;

            if (situacao == "false") {
                localStorage.removeItem("codigo");
                localStorage.removeItem("endereco");
                localStorage.removeItem("solicitacao");
                localStorage.removeItem("trabalhador");

                this.navCl.navigateRoot("inicial");
            }

            let cpf = this.trabalhador.Cpf;
            let solicitacao = JSON.parse(localStorage.getItem("solicitacao")!);

            let trabalhoFinalizado = notification.data.trabalhoFinalizado;

            if (trabalhoFinalizado == "true") {
                this.navCl.navigateRoot("/avaliacao");
            }

        });

        PushNotifications.addListener("pushNotificationActionPerformed", (action: ActionPerformed) => {
            let situacao = action.notification.data.situacaoServico;

            if (situacao == "false") {
                localStorage.removeItem("codigo");
                localStorage.removeItem("endereco");
                localStorage.removeItem("solicitacao");
                localStorage.removeItem("trabalhador");

                this.navCl.navigateRoot("inicial");
            }
        });
    }

    async ionViewDidEnter() {
        await this.carregarScriptGoogleMaps();
        await this.pegarCoords();
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
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiGoogle}&libraries=places`;
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

    async pegarCoords() {
        let endereco = localStorage.getItem("endereco");
        let link = `https://maps.googleapis.com/maps/api/geocode/json?address=${endereco}&key=AIzaSyDLQuCu8-clWnemW9ey9s5Hpz2vulxMEzM`;
        let res: any = await firstValueFrom(this.http.get(link));
        let coords = res.results[0].geometry.location;

        this.destino = new google.maps.LatLng(coords.lat, coords.lng);
    }

    async carregarMapa() {
        const options: PositionOptions = {
            enableHighAccuracy: true
        };

        const opcoesMapa: google.maps.MapOptions = {
            mapId: "20efc0a42b57f656",
            center: this.destino,
            zoom: 12,
            heading: 0,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
        };

        const mapa = document.querySelector("#mapa") as HTMLDivElement;
        this.mapa = new google.maps.Map(mapa, opcoesMapa);

        this.servicoDirecoes = new google.maps.DirectionsService();

        this.renderizadorDirecoes = new google.maps.DirectionsRenderer({
            map: this.mapa,
            suppressMarkers: true
        });

        this.pegarLocalizacaoTrabalhador();
    }

    pegarLocalizacaoTrabalhador() {
        this.firestore.collection("localizacoes").doc(this.trabalhador.Cpf).valueChanges().subscribe(async (coords: any) => {
            let posicao = coords;
            const localizacaoAjustada = new google.maps.LatLng(posicao.latitude, posicao.longitude);

            if (!this.ultimaPosicao) {
                this.ultimaPosicao = localizacaoAjustada;

                this.calcularRota(localizacaoAjustada);
            }
            else {
                const distancia = this.calcularDistancia(this.ultimaPosicao, localizacaoAjustada);

                if (distancia >= 3) {
                    this.calcularRota(localizacaoAjustada);
                }

                this.ultimaPosicao = localizacaoAjustada;
            }
        });
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
                    this.animateMarkerTo(this.marcadorA, origem);
                    // this.moverMarcadorSuavemente(this.marcadorA, this.marcadorA.getPosition()!, inicio!, 500);
                }

                if (!this.marcadorB) {
                    this.marcadorB = new google.maps.Marker({
                        map: this.mapa,
                        position: this.destino,
                        title: "Destino",
                    });
                }

                let distanciaDestino = this.calcularDistancia(origem, this.destino);

                if (distanciaDestino <= 5) {
                    this.renderizadorDirecoes.set('directions', null);
                    this.marcadorA.setMap(null);
                    this.mapa.setZoom(20);
                    this.mapa.panTo(this.destino);
                }
                else {
                    this.renderizadorDirecoes.setDirections(result);
                    this.marcadorA.setMap(this.mapa);
                }
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

            contador++;
            if (contador >= passos) {
                clearInterval(animacao);
            }
        }, intervalo);
    }

    animateMarkerTo(marker: any, newPosition: any) {
        var options = {
            duration: 1000,
            easing: function (x: any, t: any, b: any, c: any, d: any) { // jquery animation: swing (easeOutQuad)
                return -c * (t /= d) * (t - 2) + b;
            }
        };

        window.requestAnimationFrame = window.requestAnimationFrame || window.requestAnimationFrame || window.requestAnimationFrame || window.requestAnimationFrame;
        window.cancelAnimationFrame = window.cancelAnimationFrame || window.cancelAnimationFrame;

        // save current position. prefixed to avoid name collisions. separate for lat/lng to avoid calling lat()/lng() in every frame
        marker.AT_startPosition_lat = marker.getPosition().lat();
        marker.AT_startPosition_lng = marker.getPosition().lng();
        var newPosition_lat = newPosition.lat();
        var newPosition_lng = newPosition.lng();

        // crossing the 180° meridian and going the long way around the earth?
        if (Math.abs(newPosition_lng - marker.AT_startPosition_lng) > 180) {
            if (newPosition_lng > marker.AT_startPosition_lng) {
                newPosition_lng -= 360;
            } else {
                newPosition_lng += 360;
            }
        }

        var animateStep = function (marker: any, startTime: any) {
            var ellapsedTime = (new Date()).getTime() - startTime;
            var durationRatio = ellapsedTime / options.duration; // 0 - 1
            var easingDurationRatio = options.easing(durationRatio, ellapsedTime, 0, 1, options.duration);

            if (durationRatio < 1) {
                marker.setPosition({
                    lat: (
                        marker.AT_startPosition_lat +
                        (newPosition_lat - marker.AT_startPosition_lat) * easingDurationRatio
                    ),
                    lng: (
                        marker.AT_startPosition_lng +
                        (newPosition_lng - marker.AT_startPosition_lng) * easingDurationRatio
                    )
                });

                // use requestAnimationFrame if it exists on this browser. If not, use setTimeout with ~60 fps
                if (window.requestAnimationFrame) {
                    marker.AT_animationHandler = window.requestAnimationFrame(function () { animateStep(marker, startTime) });
                } else {
                    marker.AT_animationHandler = setTimeout(function () { animateStep(marker, startTime) }, 17);
                }

            } else {
                marker.setPosition(newPosition);
            }
        }

        // stop possibly running animation
        if (window.cancelAnimationFrame) {
            window.cancelAnimationFrame(marker.AT_animationHandler);
        } else {
            clearTimeout(marker.AT_animationHandler);
        }

        animateStep(marker, (new Date()).getTime());
    }

    abrirChat() {
        this.navCl.navigateRoot("/cliente/chat");
    }

    async gerarCodigo() {
        let link = dominio + "/SolicitacaoServico/GerarCodigoAleatorio";
        let dadosForm = new FormData();
        dadosForm.append("cdSolicitacao", this.solicitacao.CdSolicitacaoServico);

        try {
            this.carregar = true;
            this.codigo = await firstValueFrom(this.http.post(link, dadosForm));
            localStorage.setItem("codigo", this.codigo);

            this.enviarCodigo(this.trabalhador.TokenFCM, this.codigo);
        }
        catch {
            const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
            alert.message = "Erro ao conectar-se ao servidor";
            alert.present();
        }
        finally {
            this.carregar = false;
        }
    }

    async enviarCodigo(token: any, codigo: any) {
        let link = dominio + "/SolicitacaoServico/EnviarCodigo";
        let dadosForm = new FormData();
        dadosForm.append("token", token);
        dadosForm.append("codigo", codigo);

        try {
            await firstValueFrom(this.http.post(link, dadosForm));
        }
        catch {
            const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
            alert.message = "Erro ao conectar-se ao servidor";
            alert.present();
        }
    }

    mudartxtCancelar() {
        let txtAdvertenciaCancelar = document.querySelector('.txt_cancelar_poupop') as HTMLTextAreaElement;
        let btnProsseguir = document.querySelector(".form__btn") as HTMLIonButtonElement;
        let modalCancelar = document.querySelector("#modal_cancelar") as HTMLIonModalElement;

        txtAdvertenciaCancelar.style.display = "none";

        this.msgPoupopCancelar = 'Pedido cancelado!';

        btnProsseguir.textContent = "Ok";
        btnProsseguir.addEventListener("click", function () {
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

    voltarPag() {
        this.navCl.navigateRoot("/inicial");
    }

    tokenTrabalhador: any = this.trabalhador.TokenFCM;
    modalCancelar: any;

    async ignorarServico() {
        let dadosForm = new FormData();
        dadosForm.append("token", this.tokenTrabalhador);
        dadosForm.append("trabalhador", localStorage.getItem("cliente")!);
        dadosForm.append("situacaoServico", "false");
        let link = dominio + "/Trabalhador/EnviarServicoAceito";

        try {
            let resposta = await firstValueFrom(this.http.post(link, dadosForm, { responseType: "text" }));
            localStorage.removeItem("cliente");
            localStorage.removeItem("endereco");
            localStorage.removeItem("solicitacao");
            localStorage.removeItem("confirmacao");

            this.navCl.navigateRoot("/trabalhador/inicial");
            this.modalCancelar.dismiss();
        }
        catch (erro: any) {
            const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
            alert.message = "Erro ao conectar-se ao servidor";
            alert.present();
        }
    }
}
