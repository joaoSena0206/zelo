import { Component, ElementRef, input, OnInit, ViewChild } from '@angular/core';
import { IonIcon, IonInput } from '@ionic/angular';

@Component({
    selector: 'app-cadastro-cliente',
    templateUrl: './cadastro-cliente.page.html',
    styleUrls: ['./cadastro-cliente.page.scss'],
})
export class CadastroClientePage implements OnInit {
    date: any;
    
    regexNome: RegExp = /[^a-zA-Zà-úÀ-úçÇñÑ_ ]+/g;
    
    constructor() {
        
    }

    ngOnInit() {
    }

    ngAfterViewInit()
    {
    
    }

    estadoSenha(event: any)
    {
        const olho = event.target as HTMLIonIconElement;
        const input = event.target.parentElement as HTMLIonInputElement;

        if (input.type == "password")
        {
            olho.name = "eye-off-outline";
            input.type = "text";
        }
        else
        {
            olho.name = "eye-outline";
            input.type = "password";
        }
    }

    marcarQuadrado(event: any)
    {
        const quadrado = event.target as HTMLIonIconElement;

        if (quadrado.src == "../../../assets/icon/cliente/quadrado.svg")
        {
            quadrado.src = "../../../assets/icon/cliente/quadrado_marcado.svg"
        }
        else
        {
            quadrado.src = "../../../assets/icon/cliente/quadrado.svg"
        }
    }

    filtroInput(event: any, regex: RegExp)
    {
        const input = event.target as HTMLIonInputElement;
        const vl = input.value;
        const vlFiltrado = vl?.toString().replace(regex, "");

        event.target.value = vlFiltrado;
    }
}
