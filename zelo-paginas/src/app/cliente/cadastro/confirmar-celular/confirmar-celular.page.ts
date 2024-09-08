import { Component, input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-confirmar-celular',
    templateUrl: './confirmar-celular.page.html',
    styleUrls: ['./confirmar-celular.page.scss'],
})
export class ConfirmarCelularPage implements OnInit {

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

    voltarPag() {
        this.navCl.back();
    }
}
