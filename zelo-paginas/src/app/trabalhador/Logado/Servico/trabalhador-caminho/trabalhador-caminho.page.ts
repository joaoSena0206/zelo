/// <reference types="google.maps" />
import { Component, OnInit } from '@angular/core';
import { PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';
import { ClearWatchOptions, Geolocation, Position } from '@capacitor/geolocation';
import { apiGoogle } from 'src/app/gerais';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { Network } from '@capacitor/network';
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
    watchId: string;
    trabalhador: any = JSON.parse(localStorage.getItem("trabalhadorEscolhido")!);

    constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

    ngOnInit() {
        PushNotifications.addListener("pushNotificationReceived", (notification: PushNotificationSchema) => {
            let codigo = notification.data.codigo;
            localStorage.setItem("codigo", codigo);
        });
    }

    async ionViewDidEnter() {
        await this.carregarScriptGoogleMaps();
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

    async carregarMapa() {
        const options: PositionOptions = {
            enableHighAccuracy: true
        };
        const posicao = await Geolocation.getCurrentPosition(options);
        const localizacaoAtual = new google.maps.LatLng(
            posicao.coords.latitude,
            posicao.coords.longitude
        );

        const opcoesMapa = {
            center: localizacaoAtual,
            zoom: 14
        };

        const mapa = document.querySelector("#mapa") as HTMLDivElement;
        this.mapa = new google.maps.Map(mapa, opcoesMapa);
        this.servicoDirecoes = new google.maps.DirectionsService();
        this.renderizadorDirecoes = new google.maps.DirectionsRenderer();
        this.renderizadorDirecoes.setMap(this.mapa);

        this.rastrearTempoReal();
    }

    async pegarCoords(endereco: string) {
        let link = `https://maps.googleapis.com/maps/api/geocode/json?address=${endereco}&key=AIzaSyDLQuCu8-clWnemW9ey9s5Hpz2vulxMEzM`;
        let res: any = await firstValueFrom(this.http.get(link));
        let coords = res.results[0].geometry.location;

        return coords;
    }

    async rastrearTempoReal() {
        this.watchId = await Geolocation.watchPosition({
            enableHighAccuracy: true
        }, async (posicao: Position | null) => {
            if (posicao) {
                const localizacao = new google.maps.LatLng(posicao.coords.latitude, posicao.coords.longitude);
                const precisao = posicao.coords.accuracy;
                const status = await Network.getStatus();

                if (precisao <= 20) {
                    if (!this.ultimaPosicao) {
                        this.ultimaPosicao = localizacao;
                        console.log(this.ultimaPosicao);

                        this.calcularRota(localizacao);
                    }
                    else if (status.connectionType !== "wifi") {
                        let distanciaPercorrida = this.calcularDistancia(this.ultimaPosicao, localizacao);

                        if (distanciaPercorrida >= 5) {
                            this.calcularRota(localizacao);
                        }
                    }
                }
            }
        });
    }

    calcularDistancia(pos1: google.maps.LatLng, pos2: google.maps.LatLng): number {
        const R = 6371e3;
        const lat1 = pos1.lat() * (Math.PI / 180);
        const lat2 = pos2.lat() * (Math.PI / 180);
        const deltaLat = (pos2.lat() - pos1.lat()) * (Math.PI / 180);
        const deltaLng = (pos2.lng() - pos1.lng()) * (Math.PI / 180);

        const a =
            Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distancia = R * c;

        return distancia;
    }

    async calcularRota(origem: google.maps.LatLng) {
        let destino: google.maps.LatLng = await this.pegarCoords(localStorage.getItem("endereco")!);

        const request: google.maps.DirectionsRequest = {
            origin: origem,
            destination: destino,
            travelMode: google.maps.TravelMode.DRIVING
        };

        this.servicoDirecoes.route(request, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                this.renderizadorDirecoes.setDirections(result);

                this.distancia = result?.routes[0].legs[0].distance?.text;
                this.duracao = result?.routes[0].legs[0].duration?.text;

                let data = new Date();
                this.tempoAtual = data.toLocaleTimeString().substring(0, data.toLocaleTimeString().length - 3);

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

}
