import { Component, input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TermosPageModule } from 'src/app/geral/termos/termos.module';

@Component({
    selector: 'app-confirmar-celular',
    templateUrl: './confirmar-celular.page.html',
    styleUrls: ['./confirmar-celular.page.scss'],
})
export class ConfirmarCelularPage implements OnInit {
    tempo: number = 60;

    constructor(private navCl: NavController) { }

    ngOnInit() {
        
    }

    ngAfterViewInit() {
        const inputs = document.querySelectorAll("ion-input");

        for (let i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener("ionInput", function () {
                let apagado = false;

                if (/[^\d]/g.test(inputs[i].value?.toString()!)) {
                    apagado = true;
                }

                inputs[i].value = inputs[i].value?.toString().replace(/[^\d]/g, "");

                if (inputs[i].value != "" && i != inputs.length - 1 && apagado == false) {
                    inputs[i + 1].setFocus();
                }
                else if (inputs[i].value == "" && i != 0 && apagado == false) {
                    inputs[i - 1].setFocus();
                }
            });
        }
    }

    ionViewDidEnter() {
        const btns = document.querySelectorAll(".form__btn");
        const btnReenviar = document.querySelector(".form__btn--reenviar");

        if ((btns[0] as HTMLIonButtonElement).offsetHeight != (btns[1] as HTMLIonButtonElement).offsetHeight) {
            (btns[0] as HTMLIonButtonElement).style.height = (btns[1] as HTMLIonButtonElement).offsetHeight + "px";
        }

        window.addEventListener("resize", function () {
            const btns = document.querySelectorAll(".form__btn");

            if ((btns[0] as HTMLIonButtonElement).offsetHeight != (btns[1] as HTMLIonButtonElement).offsetHeight) {
                (btns[0] as HTMLIonButtonElement).style.height = (btns[1] as HTMLIonButtonElement).offsetHeight + "px";
            }
        });

        const intervalo = setInterval(() => {
            this.tempo -= 1;

            if (this.tempo == 0)
            {
                clearInterval(intervalo);
            }
        }, 1000);
    }

    voltarPag() {
        this.navCl.back();
    }
}
