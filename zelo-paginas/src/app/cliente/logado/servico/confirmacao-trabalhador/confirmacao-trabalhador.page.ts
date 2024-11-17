import { Component, OnInit } from '@angular/core';
import {
    ActionPerformed,
    PushNotificationSchema,
    PushNotifications,
    Token,
} from '@capacitor/push-notifications';
import { NavController } from '@ionic/angular';
import { dominio, headerNgrok } from 'src/app/gerais';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-confirmacao-trabalhador',
    templateUrl: './confirmacao-trabalhador.page.html',
    styleUrls: ['./confirmacao-trabalhador.page.scss'],
})
export class ConfirmacaoTrabalhadorPage implements OnInit {
    tempo: any;
    id: any;
    trabalhador: any = JSON.parse(localStorage.getItem("trabalhadorEscolhido")!);
    cliente: any = JSON.parse(localStorage.getItem("cliente")!);
    solicitacao: any = JSON.parse(localStorage.getItem("solicitacao")!);

    constructor(private navCl: NavController, private http: HttpClient) { }

    ngOnInit() {
        PushNotifications.addListener("pushNotificationReceived", (notification: PushNotificationSchema) => {
            let cpf = this.trabalhador.Cpf;
            let solicitacao = JSON.parse(localStorage.getItem("solicitacao")!);

            let situacao = notification.data.situacaoServico;

            if (situacao == "true") {
                clearInterval(this.id);

                this.adicionarTrabalhadorSolicitacao(cpf, solicitacao.CdSolicitacaoServico);
            }
            else {
                localStorage.removeItem("confirmacao");
                localStorage.removeItem("trabalhadorEscolhido");

                clearInterval(this.id);

                this.navCl.navigateRoot("/escolher-trabalhador");
            }
        });

        if (!localStorage.getItem("confirmacao")) {
            let confirmacao = {
                min: 5,
                seg: 0
            };

            this.tempo = confirmacao;
            localStorage.setItem("confirmacao", JSON.stringify(confirmacao));
        }
        else {
            this.tempo = JSON.parse(localStorage.getItem("confirmacao")!);
        }

        PushNotifications.addListener("pushNotificationReceived", (notification: PushNotificationSchema) => {
            if (notification.data.situacaoServico == "false") {
                localStorage.removeItem("confirmacao");
                localStorage.removeItem("trabalhadorEscolhido");

                clearInterval(this.id);

                this.navCl.navigateRoot("/escolher-trabalhador");
            }
        });

        PushNotifications.addListener("pushNotificationActionPerformed", (res: ActionPerformed) => {
            if (res.notification.data.situacaoServico == "false") {
                localStorage.removeItem("confirmacao");
                localStorage.removeItem("trabalhadorEscolhido");

                clearInterval(this.id);

                this.navCl.navigateRoot("/escolher-trabalhador");
            }
        });

        this.temporizador();
    }

    temporizador() {
        if (this.tempo.min.toString().length == 1) {
            this.tempo.min = "0" + this.tempo.min.toString();
        }

        if (this.tempo.seg.toString().length == 1) {
            this.tempo.seg = "0" + this.tempo.seg.toString();
        }

        this.id = setInterval(() => {
            if (Number(this.tempo.seg) == 0) {
                this.tempo.seg = 60;
                this.tempo.min -= 1;
            }

            if (this.tempo.min.toString().length == 1) {
                this.tempo.min = "0" + this.tempo.min.toString();
            }

            this.tempo.seg -= 1;

            if (this.tempo.seg.toString().length == 1) {
                this.tempo.seg = "0" + this.tempo.seg.toString();
            }

            localStorage.setItem("confirmacao", JSON.stringify(this.tempo));

            if (Number(this.tempo.min) == 0 && Number(this.tempo.seg) == 0) {
                this.cancelar(this.id);
            }
        }, 1000);
    }

    async adicionarTrabalhadorSolicitacao(cpf: any, cdSolicitacao: any) {
        let link = dominio + `/SolicitacaoServico/AdicionarTrabalhador`;
        let dadosForm = new FormData();
        dadosForm.append("cpf", cpf);
        dadosForm.append("cdSolicitacao", cdSolicitacao);

        try {
            let res: any = await firstValueFrom(this.http.post(link, dadosForm, { headers: headerNgrok }));

            let solicitacao = JSON.parse(localStorage.getItem("solicitacao")!);
            solicitacao.Trabalhador = {
                Cpf: cpf
            };

            localStorage.setItem("solicitacao", JSON.stringify(solicitacao));
            localStorage.removeItem("confirmacao");

            this.navCl.navigateRoot("/pagamento");
        }
        catch {
            const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
            alert.message = "Erro ao conectar-se ao servidor";
            alert.present();
        }
    }

    async cancelar(id: any) {
        let link = dominio + "/Cliente/CancelarSolicitacao";
        let dadosForm = new FormData();
        dadosForm.append("token", this.trabalhador.TokenFCM);
        dadosForm.append("situacaoServico", "false");
        dadosForm.append("nmCliente", this.cliente.Nome);

        await firstValueFrom(this.http.post(link, dadosForm));

        localStorage.removeItem("confirmacao");
        localStorage.removeItem("trabalhadorEscolhido");

        clearInterval(id);

        this.navCl.navigateRoot("/escolher-trabalhador");
    }
}
