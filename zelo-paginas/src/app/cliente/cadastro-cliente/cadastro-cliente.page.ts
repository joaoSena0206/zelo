import { Component, ElementRef, input, OnInit, ViewChild } from '@angular/core';
import { IonIcon } from '@ionic/angular';

@Component({
    selector: 'app-cadastro-cliente',
    templateUrl: './cadastro-cliente.page.html',
    styleUrls: ['./cadastro-cliente.page.scss'],
})
export class CadastroClientePage implements OnInit {
    date: any;
    
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
}
