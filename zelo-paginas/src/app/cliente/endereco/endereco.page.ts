import { HttpClient } from '@angular/common/http';
import { Component, OnInit, viewChild, ViewChild } from '@angular/core';

import { MaskitoOptions, MaskitoElementPredicate } from '@maskito/core';

@Component({
    selector: 'app-endereco',
    templateUrl: './endereco.page.html',
    styleUrls: ['./endereco.page.scss'],
})
export class EnderecoPage implements OnInit {
    @ViewChild("estado") inputEstado: HTMLIonInputElement;
    @ViewChild("cidade") inputCidade: HTMLIonInputElement;
    @ViewChild("bairro") inputBairro: HTMLIonInputElement;
    @ViewChild("rua") inputRua: HTMLIonInputElement;

    readonly cepMask: MaskitoOptions = {
        mask: [/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/]
    };

    readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();
    
    constructor(private http: HttpClient) {
        
    }

    ngOnInit() {
    }

    buscarCep(cep: any)
    {
        if (cep.length == 9)
        {
            const link = `https://viacep.com.br/ws/${cep.replace("-", "")}/json/`;

            this.http.get(link).subscribe(res => {
                let dados: any = res;

                this.inputEstado.value = dados.uf;
                this.inputCidade.value = dados.localidade;
                this.inputBairro.value = dados.bairro;
                this.inputRua.value = dados.logradouro;
            });


        }
    }
}
