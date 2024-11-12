import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { ViewChild, ElementRef } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { dominio, headerNgrok } from 'src/app/gerais';
import { first, firstValueFrom } from 'rxjs';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import validator from 'cpf-cnpj-validator';

@Component({
    selector: 'app-privacidade',
    templateUrl: './privacidade.page.html',
    styleUrls: ['./privacidade.page.scss'],
})
export class PrivacidadePage implements OnInit {

    trabalhador: any = JSON.parse(localStorage.getItem("trabalhador")!);
    novoTexto: any;
    isDisabled = true;
    isDisabled2 = true;
    cpf: any = this.trabalhador.Cpf;
    cpfFormatado: any;
    dominio = dominio;
    carregar: boolean = false;
    situacaoBotao: boolean = true;

    form = new FormGroup({
        senhas: new FormGroup({
            senhaAtual:  new FormControl("", Validators.required),
            senha: new FormControl("", [Validators.required, validadorSenha()]),
            confirmarSenha: new FormControl("")
        }, validadorSenhaConfere()),
    });

    formDados = new FormGroup({
        nomeCaixa: new FormControl({ value: this.trabalhador.Nome, disabled: true }, [Validators.required]),
        email: new FormControl({ value: this.trabalhador.Email, disabled: true }, [Validators.required, Validators.email])
    });

    erro: any = {
        form: "",
        formDados: "",
        email: "Email obrigatório",
        senha: "Senha obrigatório",
        senhaAtual: "Digite sua senha atual",
        nomeCaixa: "Nome obrigatório"
    };

    constructor(private fb: FormBuilder, private navCl: NavController, private http: HttpClient, private eRef: ElementRef) { }

    ngOnInit() { }

    validacaoInput(control: FormControl) {
        let nome = this.acharNomeControl(control);
        let vlControl = control.value as String;
        let invalido = false;

        Object.keys(this.form.controls).forEach(item => {
            if (this.form.get(item)?.hasError("invalido")) {
                this.form.get(item)?.setErrors({ invalido: null });
                this.form.get(item)?.updateValueAndValidity();
            }
        });

        Object.keys(this.formDados.controls).forEach(item => {
            if (this.formDados.get(item)?.hasError("invalido")) {
                this.formDados.get(item)?.setErrors({ invalido: null });
                this.formDados.get(item)?.updateValueAndValidity();
            }
        });

        this.erro.form = "";
        this.erro.formDados = "";

        if (control.hasError("required")) {
            this.erro[nome] = `${nome[0].toUpperCase() + nome.replace(nome[0], "")} obrigatório!`;
        }
        else if(control.hasError("email")) {
            this.erro[nome] = `Email inválido!`;
            return;
        }
        else {
            let erros = control.errors;

            if (erros != null) {
                Object.keys(erros).forEach(erro => {
                    this.erro[nome] = erros![erro].msg;
                });
            }
            else {
                this.erro[nome] = "";
            }
        }
    }

    filtroInput(event: any, regex: RegExp) {
        const input = event.target as HTMLIonInputElement;
        const vl = input.value;
        const vlFiltrado = vl?.toString().replace(regex, "");

        event.target.value = vlFiltrado;
    }

    acharNomeControl(control: FormControl) {
        let controlName = "";

        Object.keys(this.form.controls).forEach(item => {
            if (item == "senhas") {
                Object.keys(this.form.controls["senhas"].controls).forEach(senha => {
                    if (this.form.controls["senhas"].get(senha) === control) {
                        controlName = senha;
                    }
                });
            }
            else if (this.form.get(item) === control) {
                controlName = item;
            }
        });

        Object.keys(this.formDados.controls).forEach(item => {
            if (this.formDados.get(item) === control) {
                controlName = item;
            }
        });

        return controlName;
    }

    estadoSenha(event: any) {
        const olho = event.target as HTMLIonIconElement;
        const input = event.target.parentElement as HTMLIonInputElement;

        if (input.type == "password") {
            olho.name = "eye-outline";
            input.type = "text";
        }
        else {
            olho.name = "eye-off-outline";
            input.type = "password";
        }
    }

    voltarPag() {
        this.navCl.back();
    }

    ngAfterViewInit() {
        this.FormatarData();

        const inputs = document.querySelectorAll("ion-input");

        inputs.forEach((input: HTMLIonInputElement) => {
            input.addEventListener("ionBlur", function () {

                if(input.id != "senha")
                {
                    input.disabled = true;
                    input.style.border = 'none';
                }
                {
                    input.style.border = 'none';
                }
            });
        });

        inputs.forEach((input: HTMLIonInputElement) => {
            input.addEventListener("ionFocus", function () {
                if(input.id == "senha")
                {
                    input.style.border = 'black 1px solid';
                }
            });
        });

        inputs.forEach((input: HTMLIonInputElement) => {
            input.addEventListener("ionFocus", function () {
                if(input.id == "senha")
                {
                    input.style.border = 'black 1px solid';
                }
            });
        });

        this.formatCPF(this.cpf);
    }

    formatCPF(cpf: string): string {
        cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

        this.cpfFormatado = cpf;
        return cpf;
    }


    FormatarData() {
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

        if (input.placeholder == "Nome") {
            this.formDados.controls['nomeCaixa'].enable();
        }
        else {
            this.formDados.controls['email'].enable();
        }

        input.style.border = 'black 1px solid';

        setTimeout(() => {
            input.setFocus();
        }, 100);
    }

    situacao1: boolean = false;
    situacao2: boolean = false;

    AtivarBotaoSalvar(event: KeyboardEvent) {
        if (this.formDados.invalid) {
            this.formDados.markAllAsTouched();
            this.situacao1 = true;
            this.isFormValid();
        } 
        else{
            this.situacao1 = false;
            this.isFormValid();
        }
    }

    AtivarBotaoSalvar2(event: KeyboardEvent) {
         if (this.form.invalid) {
             this.form.markAllAsTouched();
             this.situacao2 = true;
             this.isFormValid();
         } 
         else{
            this.situacao2 = false;
            this.isFormValid();
         }
     }

     isFormValid(){
        if(this.situacao1 == true)
        {
            this.situacaoBotao = true;
        }
        else
        {
            if(this.situacao2 == true)
            {
                this.situacaoBotao = true;
            }
            else
            {
                this.situacaoBotao = false;
            }
        }
    }

    async salvar() {
        let nome = document.querySelector("#inputNome") as HTMLIonInputElement;
        let email = document.querySelector("#inputEmail") as HTMLIonInputElement;
            
                let link = dominio + "/Trabalhador/AlterarDados";

                let trabalhador = JSON.parse(localStorage.getItem("trabalhador")!);
                let dadosForm = new FormData();

                dadosForm.append("cpf", trabalhador.Cpf);
                dadosForm.append("nome", "Nome");
                dadosForm.append("email", nome.value?.toString()!);
                dadosForm.append("senha", nome.value?.toString()!);

                try {
                    this.carregar = true;
                    let resposta = await firstValueFrom(this.http.post(link, dadosForm, { headers: headerNgrok }));
                    trabalhador.Nome = nome.value;

                    localStorage.setItem("trabalhador", JSON.stringify(trabalhador));
                }
                catch (erro: any) {
                    const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
                    alert.message = "Erro ao conectar-se ao servidor";
                    alert.present();
                }
                finally {
                    this.carregar = false;
                }
            
        
    }

}

export function validadorSenha(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        let senha = control.value;
        let regexEspeciais = /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;'/]/g;
        let regexNumeros = /\d/g;
        let regexLetras = /[a-zA-Z]/g;

        if (senha.length >= 8 && regexEspeciais.test(senha) && regexNumeros.test(senha) && regexLetras.test(senha)) {
            return null;
        }

        return { invalida: { msg: "Senha necessita de pelo menos 8 caracteres: letras, números, e caractéres especiais" } };
    };
};

export function validadorSenhaConfere(): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
        let senha = form.get("senha")?.value;
        let confirmarSenha = form.get("confirmarSenha")?.value;

        if (senha != confirmarSenha) {
            return { confere: { msg: "Senhas não conferem" } };
        }

        return null;
    };
};