import { Component, OnInit } from '@angular/core';

import { MaskitoOptions, MaskitoElementPredicate } from '@maskito/core';

@Component({
    selector: 'app-endereco',
    templateUrl: './endereco.page.html',
    styleUrls: ['./endereco.page.scss'],
})
export class EnderecoPage implements OnInit {
    readonly cepMask: MaskitoOptions = {
        mask: [/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/]
    };

    readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();
    
    constructor() {
        
    }

    ngOnInit() {
    }

    filtroInput(event: any, regex: RegExp)
    {
        const input = event.target as HTMLIonInputElement;
        const vl = input.value;
        const vlFiltrado = vl?.toString().replace(regex, "");

        event.target.value = vlFiltrado;
    }
}
