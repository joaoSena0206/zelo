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
    selector: 'app-confirmacao-cliente',
    templateUrl: './confirmacao-cliente.page.html',
    styleUrls: ['./confirmacao-cliente.page.scss'],
})
export class ConfirmacaoClientePage implements OnInit {
    tempo: any;
    id: any;
    trabalhador: any = JSON.parse(localStorage.getItem("trabalhador")!);
    clienteServico: any = JSON.parse(localStorage.getItem("cliente")!);
    idPagamento: any;

    constructor(private navCl: NavController, private http: HttpClient) { }

    ngOnInit() {
        PushNotifications.removeAllListeners();

        PushNotifications.addListener("pushNotificationReceived", (notification: PushNotificationSchema) => {
            this.idPagamento = notification.data.id;
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

        this.temporizador();
    }

    async checarPagamento() {
        if (this.idPagamento) {
            let id = this.idPagamento;
            let link = dominio + "/Cliente/ChecarPagamento?id=" + id;

            try {
                let res: any = await firstValueFrom(this.http.get(link));

                if (res.status == "approved") {
                    clearInterval(this.id);

                    localStorage.removeItem("confirmacao");

                    this.navCl.navigateRoot("trabalhador/trabalhador-caminho");
                }
                else if (res.status == "cancelled") {
                    clearInterval(this.id);

                    localStorage.removeItem("cliente");
                    localStorage.removeItem("endereco");
                    localStorage.removeItem("solicitacao");
                    localStorage.removeItem("confirmacao");

                    this.navCl.navigateRoot("trabalhador/inicial");
                }
            }
            catch {
                const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
                alert.message = "Erro ao conectar-se ao servidor";
                alert.present();
            }
        }
    }

    async enviarCancelamento() {
        let trabalhador = JSON.parse(localStorage.getItem("trabalhadorEscolhido")!);
        let cliente = JSON.parse(localStorage.getItem("cliente")!);
        let link = dominio + "/Cliente/EnviarPagamentoCancelado";
        let dadosForm = new FormData();
        dadosForm.append("pago", "false");
        dadosForm.append("token", trabalhador.TokenFCM);
        dadosForm.append("nmCliente", cliente.Nome);

        try {
            await firstValueFrom(this.http.post(link, dadosForm));
        }
        catch {
            const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
            alert.message = "Erro ao conectar-se ao servidor";
            alert.present();
        }
    }

    temporizador() {
        if (this.tempo.min.toString().length == 1) {
            this.tempo.min = "0" + this.tempo.min.toString();
        }

        if (this.tempo.seg.toString().length == 1) {
            this.tempo.seg = "0" + this.tempo.seg.toString();
        }

        this.id = setInterval(() => {
            this.checarPagamento();

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

    async cancelar(id: any) {
        let link = dominio + "/Trabalhador/CancelarSolicitacao";
        let dadosForm = new FormData();
        dadosForm.append("token", this.clienteServico.TokenFCM);
        dadosForm.append("situacaoServico", "false");
        dadosForm.append("nmTrabalhador", this.trabalhador.Nome);

        await firstValueFrom(this.http.post(link, dadosForm));

        localStorage.removeItem("cliente");
        localStorage.removeItem("endereco");
        localStorage.removeItem("solicitacao");
        localStorage.removeItem("confirmacao");

        clearInterval(this.id);

        this.navCl.navigateBack("/trabalhador/inicial");
    }

}
