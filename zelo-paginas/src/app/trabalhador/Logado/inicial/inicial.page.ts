import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonList, ModalController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { first, firstValueFrom } from 'rxjs';
import { BackgroundRunner } from '@capacitor/background-runner';
import { dominio, headerNgrok } from 'src/app/gerais';
import { NavController } from '@ionic/angular';
import { BackgroundGeolocationPlugin } from "@capacitor-community/background-geolocation";
import { registerPlugin } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { DOCUMENT } from '@angular/common';
import {
    ActionPerformed,
    PushNotificationSchema,
    PushNotifications,
    Token,
} from '@capacitor/push-notifications';

const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>("BackgroundGeolocation");

@Component({
    selector: 'app-inicial',
    templateUrl: './inicial.page.html',
    styleUrls: ['./inicial.page.scss'],
})
export class InicialPage implements OnInit {
    trabalhador: any = JSON.parse(localStorage.getItem("trabalhador")!);
    historico: any;
    Nome: any = this.trabalhador.nome;
    ComentarioAnonimo: any;
    qtEstrelas: any;
    carregar: boolean = false;
    watcherId: any;
    result: any;
    clienteServico: any;
    solicitacaoServico: any;
    enderecoServico: any;
    modal: any;
    dominio = dominio;

    constructor(private http: HttpClient, private navCl: NavController) {

    }

    ngOnInit() {
        PushNotifications.requestPermissions().then(result => {
            if (result.receive === "granted") {
                PushNotifications.register();
            }
            else {
                console.error("Necessário notificação");
            }
        });

        PushNotifications.addListener("registration", (token: Token) => {
            this.enviarToken(token.value);
        });

        PushNotifications.addListener("pushNotificationReceived", (notification: PushNotificationSchema) => {
            this.result = notification;

            this.clienteServico = JSON.parse(this.result.data.cliente);
            this.enderecoServico = this.result.data.endereco;
            this.solicitacaoServico = JSON.parse(this.result.data.solicitacao);

            this.modal.present();
        });

        PushNotifications.addListener("pushNotificationActionPerformed", (res: ActionPerformed) => {
            this.result = res.notification;

            this.clienteServico = JSON.parse(this.result.data.cliente);
            this.enderecoServico = this.result.data.endereco;
            this.solicitacaoServico = JSON.parse(this.result.data.solicitacao);

            this.modal.present();
        });
    }

    analisarServico() {
        localStorage.setItem("cliente", JSON.stringify(this.clienteServico));
        localStorage.setItem("endereco", JSON.stringify(this.enderecoServico));
        localStorage.setItem("solicitacao", JSON.stringify(this.solicitacaoServico));

        this.navCl.navigateForward("/analisa-servico");
        this.modal.dismiss();
    }

    ngAfterViewInit() {
        this.carregarHistorico();
        this.carregarComentarioAnonimo();
        this.modal = document.querySelector('#modal_servico_solicitado') as HTMLIonModalElement;
    }

    async ionViewDidEnter() {
        const botaoSituacao = document.querySelector('#abrir_modal_servico');
        const img = document.querySelector('.img_btn_situacao');

        let dadosForm = new FormData();
        dadosForm.append("cpf", this.trabalhador.cpf);

        let res;

        try {
            res = await firstValueFrom(this.http.post(dominio + '/Trabalhador/VerificarSituacao', dadosForm, { responseType: 'text', headers: headerNgrok }));
        }
        catch (erro: any) {
            const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
            alert.message = "Erro ao conectar-se ao servidor";
            alert.present();
        }

        if (res == "true") {
            this.situacao = 'Disponível';

            botaoSituacao?.classList.remove('btn_situacao_trabalhador');
            botaoSituacao?.classList.add('btn_situacao_trabalhador_disponivel');

            img?.setAttribute(
                'src',
                '../../../assets/icon/Trabalhador/Icone inicial/IconeAtivo.svg'
            );

            this.checarPermissao();
        }
        else {
            botaoSituacao?.classList.add('btn_situacao_trabalhador');
            botaoSituacao?.classList.remove('btn_situacao_trabalhador_disponivel');

            img?.setAttribute('src', '../../../assets/icon/Trabalhador/Icone inicial/IconeOff.svg');

            this.situacao = 'Indisponível';

            this.pararGeolocalizacao();
        }
    }

    async enviarToken(token: any) {
        let link = dominio + "/Trabalhador/AdicionarTokenFCM";
        let trabalhador = JSON.parse(localStorage.getItem("trabalhador")!);
        let dadosForm = new FormData();
        dadosForm.append("cpf", trabalhador.cpf);
        dadosForm.append("token", token);

        try {
            let resposta = await firstValueFrom(this.http.post(link, dadosForm, { headers: headerNgrok }));
        }
        catch (erro: any) {
            const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
            alert.message = "Erro ao conectar-se ao servidor";
            alert.present();
        }
    }

    async checarPermissao() {
        const statusPermissao = await LocalNotifications.checkPermissions();

        if (statusPermissao.display === "granted" || statusPermissao.display === "prompt") {
            this.chamarBackgroundGeo();
        }
        else {
            await LocalNotifications.requestPermissions();
        }
    }

    chamarBackgroundGeo() {
        BackgroundGeolocation.addWatcher(
            {
                // If the "backgroundMessage" option is defined, the watcher will
                // provide location updates whether the app is in the background or the
                // foreground. If it is not defined, location updates are only
                // guaranteed in the foreground. This is true on both platforms.

                // On Android, a notification must be shown to continue receiving
                // location updates in the background. This option specifies the text of
                // that notification.
                backgroundMessage: "Cancele para prevenir o dreno da bateria",

                // The title of the notification mentioned above. Defaults to "Using
                // your location".
                backgroundTitle: "Rastreando",

                // Whether permissions should be requested from the user automatically,
                // if they are not already granted. Defaults to "true".
                requestPermissions: true,

                // If "true", stale locations may be delivered while the device
                // obtains a GPS fix. You are responsible for checking the "time"
                // property. If "false", locations are guaranteed to be up to date.
                // Defaults to "false".
                stale: false,

                // The minimum number of metres between subsequent locations. Defaults
                // to 0.
                distanceFilter: 10
            },
            async (location, error) => {
                if (error) {
                    if (error.code === "NOT_AUTHORIZED") {
                        if (window.confirm(
                            "Esse app precisa da sua localização, " +
                            "mas não possui permissão.\n\n" +
                            "Abrir as configuraçãoes agora?"
                        )) {
                            // It can be useful to direct the user to their device's
                            // settings when location permissions have been denied. The
                            // plugin provides the 'openSettings' method to do exactly
                            // this.
                            BackgroundGeolocation.openSettings();
                        }
                    }
                    return console.error(error);
                }

                let link = dominio + "/Trabalhador/AtualizarLoc";
                let dadosForm = new FormData();
                if (location) {
                    dadosForm.append("cpf", this.trabalhador.cpf);
                    dadosForm.append("lat", location.latitude.toFixed(8));
                    dadosForm.append("log", location.longitude.toFixed(8));
                }

                try {
                    this.carregar = true;
                    let res = await firstValueFrom(this.http.post(link, dadosForm, { headers: headerNgrok }));
                }
                catch (erro: any) {
                    const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
                    alert.message = "Erro ao conectar-se ao servidor";
                    alert.present();
                }
                finally {
                    this.carregar = false;
                }

            }

        ).then(watcherId => {
            this.watcherId = watcherId;
        });
    }

    pararGeolocalizacao() {
        if (this.watcherId) {
            BackgroundGeolocation.removeWatcher({
                id: this.watcherId
            });
        }
    }

    formatarEstrelas() {
        const comentarios = document.querySelectorAll("ion-item");

        comentarios.forEach(comentario => {
            const estrelas = comentario.querySelectorAll(".estrela");

            if (estrelas.length == 3) {
                (estrelas[1] as HTMLIonIconElement).style.marginBottom = "-10px";
            }
            else if (estrelas.length == 4) {
                (estrelas[1] as HTMLIonIconElement).style.marginBottom = "-15px";
                (estrelas[2] as HTMLIonIconElement).style.marginBottom = "-15px";
            }
            else if (estrelas.length == 5) {

                (estrelas[0] as HTMLIonIconElement).style.marginTop = "-30px";
                (estrelas[4] as HTMLIonIconElement).style.marginTop = "-30px";

                (estrelas[0] as HTMLIonIconElement).style.position = "absolute";
                (estrelas[4] as HTMLIonIconElement).style.position = "absolute";

                (estrelas[0] as HTMLIonIconElement).style.marginLeft = "-45px";
                (estrelas[4] as HTMLIonIconElement).style.marginRight = "-45px";

                (estrelas[2] as HTMLIonIconElement).style.marginBottom = "-10px";
            }
        });
    }

    async carregarComentarioAnonimo() {
        let link = dominio + `/SolicitacaoServico/carregarcomentariosAnonimos?cpf=${this.trabalhador.cpf}&tipo=trabalhador`;

        let res;

        try {
            this.carregar = true;
            res = await firstValueFrom(this.http.get(link, { headers: headerNgrok }));
            this.ComentarioAnonimo = res;
        }
        catch (erro: any) {
            const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
            alert.message = "Erro ao conectar-se ao servidor";
            alert.present();
        }
        finally {
            this.carregar = false;
        }

        const observer = new MutationObserver((mutations) => {
            const comentarios = document.querySelectorAll("ion-item");

            if (comentarios.length > 0) {
                observer.disconnect();
                this.formatarEstrelas();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    async carregarHistorico() {
        let trabalhador = JSON.parse(localStorage.getItem("trabalhador")!);
        let link = dominio + `/SolicitacaoServico/CarregarUltimosPedidos?cpf=${trabalhador.cpf}&tipo=trabalhador`;

        let res: any;

        try {
            this.carregar = true;
            res = await firstValueFrom(this.http.get(link, { headers: headerNgrok }));
        }
        catch (erro: any) {
            const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
            alert.message = "Erro ao conectar-se ao servidor";
            alert.present();
        }
        finally {
            this.carregar = false;
        }
        
        this.historico = res;
    }

    async carregarImgServico(cdSolicitacao: any) {

        let urlImg = null;

        try {
            this.carregar = true;

            let link = dominio + `/ImgSolicitacao/CarregarImgs?cdSolicitacao=${cdSolicitacao}&quantidade=1`;
            let res: any = await firstValueFrom(this.http.get(link, { headers: headerNgrok }));

            if (res.length > 0) {
                link = dominio + `/Imgs/Solicitacao/${cdSolicitacao}/1${res[0].tipoArquivo}`;
            }
            else {
                link = "../../../../assets/icon/geral/sem-foto.jpg";
            }

            res = await firstValueFrom(this.http.get(link, { headers: headerNgrok, responseType: "blob" }));

            urlImg = URL.createObjectURL(res);
        }
        catch (erro: any) {
            const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
            alert.message = "Erro ao conectar-se ao servidor";
            alert.present();
        }
        finally {
            this.carregar = false;
        }

        return urlImg;
    }

    msgTrabalho: any = 'Deseja trabalhar agora?';
    situacao: any = '';
    resultado: any = '';

    gerarArrayEstrelas(numEstrelas: any) {
        let array = [];

        for (let i = 0; i < numEstrelas; i++) {
            array.push(0);
        }

        return array;
    }

    disponivel() {
        const botaoSituacao = document.querySelector('#abrir_modal_servico');
        const img = document.querySelector('.img_btn_situacao');

        if (this.situacao == 'Disponível') {

            botaoSituacao?.classList.add('btn_situacao_trabalhador');
            botaoSituacao?.classList.remove('btn_situacao_trabalhador_disponivel');

            img?.setAttribute('src', '../../../assets/icon/Trabalhador/Icone inicial/IconeOff.svg');

            this.situacao = 'Indisponível';
            this.msgTrabalho = 'Deseja trabalhar agora?';

            this.resultado = false;

            this.pararGeolocalizacao();

        } else {
            botaoSituacao?.classList.remove('btn_situacao_trabalhador');
            botaoSituacao?.classList.add('btn_situacao_trabalhador_disponivel');

            img?.setAttribute(
                'src',
                '../../../assets/icon/Trabalhador/Icone inicial/IconeAtivo.svg'
            );

            this.situacao = 'Disponível';
            this.msgTrabalho = 'Deseja parar de trabalhar?';

            this.resultado = true;

            this.checarPermissao();
        }

        let link = dominio + "/Trabalhador/AtualizarSituacao";

        let dadosForm = new FormData();
        dadosForm.append("codigoResultado", this.resultado!);
        dadosForm.append("cpf", this.trabalhador.cpf);

        try
        {
            this.http.post(link, dadosForm, { responseType: 'text', headers: headerNgrok }).subscribe(res => {})
        }
        catch (erro: any) {
            const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
            alert.message = "Erro ao conectar-se ao servidor";
            alert.present();
        }
    }
}
