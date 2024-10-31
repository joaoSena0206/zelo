import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { ViewChild, ElementRef } from '@angular/core';
import { IonInput } from '@ionic/angular';

@Component({
    selector: 'app-privacidade',
    templateUrl: './privacidade.page.html',
    styleUrls: ['./privacidade.page.scss'],
})
export class PrivacidadePage implements OnInit {

    @ViewChild('inputField', { static: false }) inputField: IonInput;

    trabalhador: any = JSON.parse(localStorage.getItem("trabalhador")!);
    novoTexto: any;
    isDisabled = true;

    constructor(private eRef: ElementRef) { }

    ngOnInit() { }

    ngAfterViewInit() {
        this.pegarDados();

        const inputs = document.querySelectorAll("ion-input");

        inputs.forEach((input: HTMLIonInputElement) => {
            input.addEventListener("ionBlur", function () {
                input.disabled = true;
                input.style.border = 'none';
            });
        });
    }

    pegarDados() {
        const dateString: string = this.trabalhador.DataNascimento;
        const timestamp: number = Date.parse(dateString);
        const date: Date = new Date(timestamp);

        let dia = date.getDate();
        let mes = date.getMonth() + 1;
        let ano = date.getFullYear();

        let DataFormatada = null;

        if (mes < 10) {
            DataFormatada = dia + "/" + "0" + mes + "/" + ano;
        }
        else {
            DataFormatada = dia + "/" + mes + "/" + ano;
        }

        this.novoTexto = DataFormatada;
    }

    abilitarInput(inputElement: any) {
        let input = inputElement.parentElement.children[0] as HTMLIonInputElement;
        input.disabled = false;
        input.style.border = 'black 1px solid';

        setTimeout(() => {
            input.setFocus();
        }, 100);
    }

    disabilitarInput() {
        this.isDisabled = true;
        
    }
}
