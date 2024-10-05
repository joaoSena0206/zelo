import { Component, OnInit } from '@angular/core';
import {
    ActionPerformed,
    PushNotificationSchema,
    PushNotifications,
    Token,
} from '@capacitor/push-notifications';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-confirmacao-trabalhador',
    templateUrl: './confirmacao-trabalhador.page.html',
    styleUrls: ['./confirmacao-trabalhador.page.scss'],
})
export class ConfirmacaoTrabalhadorPage implements OnInit {
    tempo: any = JSON.parse(localStorage.getItem("confirmacao")!);

    constructor(private navCl: NavController) { }

    ngOnInit() {
        PushNotifications.addListener("pushNotificationReceived", (notification: PushNotificationSchema) => {
            this.navCl.navigateForward("/pagamento");
        });

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
                this.navCl.navigateRoot("/pagamento");
                localStorage.removeItem("confirmacao");

                clearInterval(id);
            }
        }, 1000);
    }
}
