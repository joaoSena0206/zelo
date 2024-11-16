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
    constructor(private navCl: NavController, private http: HttpClient) { }

    ngOnInit() {
        PushNotifications.addListener("pushNotificationReceived", (notification: PushNotificationSchema) => {

            let situacao = notification.data.pago;

            if (situacao == "true") {
                this.navCl.navigateRoot("trabalhador/trabalhador-caminho");
            }
            else {
                this.cancelar();
            }

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

    cancelar() {
        localStorage.removeItem("confirmacao");
        this.navCl.navigateBack("/trabalhador/inicial");
    }

}
