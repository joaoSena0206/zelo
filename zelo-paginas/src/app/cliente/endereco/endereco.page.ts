import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-endereco',
    templateUrl: './endereco.page.html',
    styleUrls: ['./endereco.page.scss'],
})
export class EnderecoPage implements OnInit {
    date: any;

    inputNome = "";
    
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
