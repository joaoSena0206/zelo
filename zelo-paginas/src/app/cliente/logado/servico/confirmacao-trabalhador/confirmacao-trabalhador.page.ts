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

    constructor(private navCl: NavController, private http: HttpClient) { }

    ngOnInit() {
        PushNotifications.addListener("pushNotificationReceived", (notification: PushNotificationSchema) => {
            let cpf = "53890618880";
            let solicitacao = JSON.parse(localStorage.getItem("solicitacao")!);

            this.adicionarTrabalhadorSolicitacao(cpf, solicitacao.CdSolicitacaoServico);
        });

        if (!localStorage.getItem("confirmacao")) {
            let confirmacao = {
                min: 10,
                seg: 0
            };

            this.tempo = confirmacao;
            localStorage.setItem("confirmacao", JSON.stringify(confirmacao));
        }
        else {
            this.tempo = JSON.parse(localStorage.getItem("confirmacao")!);
        }

        this.temporizador();
    }

    temporizador() {
        if (this.tempo.min.toString().length == 1) {
            this.tempo.min = "0" + this.tempo.min.toString();
        }

        if (this.tempo.seg.toString().length == 1) {
            this.tempo.seg = "0" + this.tempo.seg.toString();
        }

        let id = setInterval(() => {
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
                this.cancelar();

                clearInterval(id);
            }
        }, 1000);
    }

    async adicionarTrabalhadorSolicitacao(cpf: any, cdSolicitacao: any) {
        let link = dominio + `/SolicitacaoServico/AdicionarTrabalhador`;
        let dadosForm = new FormData();
        dadosForm.append("cpf", cpf);
        dadosForm.append("cd", cdSolicitacao);

        let res = await firstValueFrom(this.http.post(link, dadosForm, { headers: headerNgrok }));

        if (res == null) {
            let solicitacao = JSON.parse(localStorage.getItem("solicitacao")!);
            solicitacao.Trabalhador.Cpf = cpf;

            localStorage.setItem("solicitacao", JSON.stringify(solicitacao));

            this.navCl.navigateForward("/pagamento");
        }
    }

    cancelar() {
        localStorage.removeItem("confirmacao");
        this.navCl.navigateBack("/escolher-trabalhador");
    }
}
