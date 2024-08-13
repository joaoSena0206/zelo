import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { Renderer2 } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { cpf } from 'cpf-cnpj-validator';

@Component({
    selector: 'app-cadastro-cliente',
    templateUrl: './cadastro-cliente.page.html',
    styleUrls: ['./cadastro-cliente.page.scss'],
})
export class CadastroClientePage implements OnInit {
    form = new FormGroup({
        nome: new FormControl("", Validators.required),
        cpf: new FormControl("", [Validators.required, validadorTamanhoMinimo(11)]),
        data: new FormControl("", [Validators.required, validadorIdade()])
    });
    
    inputData: any;
    erro: any = {
        nome: "",
        cpf: ""
    };
    nomeClass: any = "form__input";

    erronome: string = "";
    
    regexNome: RegExp = /[^a-zA-Zà-úÀ-úçÇñÑ_ ]+/g;

    readonly cpfMask: MaskitoOptions = {
        mask: [/\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, "-", /\d/, /\d/]
    };

    readonly celMask: MaskitoOptions = {
        mask: ["(", /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/]
    };

    readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();
    
    constructor(private renderer: Renderer2) {
        
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
            olho.name = "eye-outline";
            input.type = "text";
        }
        else
        {
            olho.name = "eye-off-outline";
            input.type = "password";
        }
    }

    marcarQuadrado(event: any)
    {
        const quadrado = event.target as HTMLIonIconElement;

        if (quadrado.src == "../../../assets/icon/cliente/quadrado.svg")
        {
            quadrado.setAttribute("marcado", "true");
            quadrado.src = "../../../assets/icon/cliente/quadrado_marcado.svg"
        }
        else
        {
            quadrado.setAttribute("marcado", "false");
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

    acharNomeControl(control: FormControl)
    {
        let controlName = "";
        
        for(let item in this.form.controls)
        {
            if(control === this.form.get(item))
            {
                controlName = item;
            }
        }

        return controlName;
    }

    validacaoInput(control: FormControl)
    {
        let nome = this.acharNomeControl(control);
        let vlControl = control.value as String;

        if (control.hasError("required"))
        {
            this.erro[nome] = `${nome[0].toUpperCase() + nome.replace(nome[0], "")} obrigatório!`;
        }

        if (control.hasError("tamanhoMinimo"))
        {
            this.erro[nome] = `${nome[0].toUpperCase() + nome.replace(nome[0], "")} deve ter ${control.errors?.['tamanhoMinimo']} caracteres`;
        }
    }

    mostrarData()
    {
        let data = this.form.controls['data'].value ? new Date(this.form.controls['data'].value) : null;
        this.inputData = data?.toLocaleDateString();
    }
}

export function validadorTamanhoMinimo(tamanho: Number): ValidatorFn {
    return (control: AbstractControl) : ValidationErrors | null => {
        let vl = control.value.replace(/\./g, "").replace("-", "");

        if (vl.length < tamanho)
        {
            return {tamanhoMinimo: tamanho};
        }

        return null;
    };
};

export function validadorIdade(): ValidatorFn {
    return (control: AbstractControl) : ValidationErrors | null => {
        let dataAtual = new Date();
        let dataNascimento = new Date(control.value);

        let idade = dataAtual.getFullYear() - dataNascimento.getFullYear();

        if (dataAtual.getDay() >= dataNascimento.getDay() && dataAtual.getMonth() >= dataNascimento.getMonth())
        {
            idade -= 1;
        }

        if (idade < 18)
        {
            return {idade: true};
        }

        return null;
    };
};