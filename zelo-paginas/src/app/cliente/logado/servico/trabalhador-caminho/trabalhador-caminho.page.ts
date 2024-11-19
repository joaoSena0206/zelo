/// <reference types="google.maps" />
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { apiGoogle, dominio } from 'src/app/gerais';
import { HttpClient } from '@angular/common/http';
import { first, firstValueFrom } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';
import { ActionPerformed, PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';

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

    constructor(private navCl: NavController, private http: HttpClient) { }

    ngOnInit() {
        localStorage.removeItem("idPagamento");
        localStorage.removeItem("tempoPagamento");
        localStorage.removeItem("tempoAtual");

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
        const posicao = await Geolocation.getCurrentPosition();
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
}
