import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonList } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { first, firstValueFrom } from 'rxjs';
import { BackgroundRunner } from '@capacitor/background-runner';
import { headerNgrok } from 'src/app/gerais';
import { BackgroundGeolocationPlugin } from "@capacitor-community/background-geolocation";
import { registerPlugin } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>("BackgroundGeolocation");

@Component({
    selector: 'app-inicial',
    templateUrl: './inicial.page.html',
    styleUrls: ['./inicial.page.scss'],
})
export class InicialPage implements OnInit {
    trabalhador: any = JSON.parse(localStorage.getItem("trabalhador")!);
    historico: any;
    Nome: any = this.trabalhador.Nome.trim();
    ComentarioAnonimo: any;
    qtEstrelas: any;
    carregar: boolean = false;
    watcherId: any;

    constructor(private http: HttpClient) {

    }

    ngOnInit() {
        this.carregarHistorico();
        this.carregarComentarioAnonimo();
    }

    ngAfterViewInit() {

    }

    ionViewDidEnter() {
        const botaoSituacao = document.querySelector('#abrir_modal_servico');
        const img = document.querySelector('.img_btn_situacao');

        let dadosForm = new FormData();
        dadosForm.append("cpf", this.trabalhador.Cpf);

        this.http.post('https://chow-master-properly.ngrok-free.app/Trabalhador/VerificarSituacao', dadosForm, { responseType: 'text', headers: headerNgrok }).subscribe(res => {

            if (res == "True") {
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
        });

        this.formatarEstrelas();
    }

    async checarPermissao() {
        const statusPermissao = await LocalNotifications.checkPermissions();

        if (statusPermissao.display === "granted") {
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
                distanceFilter: 200
            },
            function callback(location, error) {
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

                return console.log(location);
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

    qlComentario(Indice: number): boolean {

        this.qtEstrelas = [];

        for (let i = 0; i < this.ComentarioAnonimo[Indice]['QtEstrelasAvaliacaoServico']; i++) {
            this.qtEstrelas.push(1);
        }

        this.formatarEstrelas();

        return this.qtEstrelas;
    }

    formatarEstrelas() {
        const comentarios = document.querySelectorAll("ion-item");

        comentarios.forEach(comentario => {
            const estrelas = comentario.querySelectorAll(".estrela");

            if (estrelas.length == 3) {
                (estrelas[1] as HTMLIonIconElement).style.marginBottom = "-10px";
            }
            else if (estrelas.length == 4) {
                (estrelas[1] as HTMLIonIconElement).style.marginBottom = "-10px";
                (estrelas[2] as HTMLIonIconElement).style.marginBottom = "-10px";
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
        let link = `https://chow-master-properly.ngrok-free.app/SolicitacaoServico/carregarcomentariosAnonimos?c=${this.trabalhador.Cpf}&t=trabalhador`;

        this.carregar = true;
        let res = await firstValueFrom(this.http.get(link, { headers: headerNgrok }));
        this.carregar = false;

        this.ComentarioAnonimo = res;
    }

    async carregarHistorico() {
        let trabalhador = JSON.parse(localStorage.getItem("trabalhador")!);
        let link = `https://chow-master-properly.ngrok-free.app/SolicitacaoServico/CarregarUltimosPedidos?c=${trabalhador.Cpf}&t=trabalhador`;

        this.carregar = true;
        let res = await firstValueFrom(this.http.get(link, { headers: headerNgrok }));

        this.historico = res;
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

        let link = "https://chow-master-properly.ngrok-free.app/Trabalhador/AtualizarSituacao";

        let dadosForm = new FormData();
        dadosForm.append("Resultado", this.resultado!);
        dadosForm.append("cpf", this.trabalhador.Cpf);

        this.http.post(link, dadosForm, { responseType: 'text', headers: headerNgrok }).subscribe(res => {

        })
    }

    async pegarLocalizacao() {
        const coords = await Geolocation.getCurrentPosition();

        console.log(coords);
    }
}
