import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { ViewChild, ElementRef } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { dominio, headerNgrok } from 'src/app/gerais';
import { first, firstValueFrom } from 'rxjs';


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

    form = new FormGroup({
        email: new FormControl({ value: this.trabalhador.Email, disabled: true }, [Validators.required, Validators.email]),
        senha: new FormControl("", Validators.required)
    });

    erro: any = {
        form: "",
        email: "Email obrigatório",
        senha: "Senha obrigatório"
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

        this.erro.form = "";

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

    acharNomeControl(control: FormControl) {
        let controlName = "";

        Object.keys(this.form.controls).forEach(item => {
            if (this.form.get(item) === control) {
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
                input.disabled = true;
                input.style.border = 'none';
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
            this.isDisabled = false;
        }
        else {
            this.form.controls['email'].enable();
        }

        input.style.border = 'black 1px solid';

        setTimeout(() => {
            input.setFocus();
        }, 100);
    }

    disabilitarInput() {
        this.form.controls['email'].disable();
        this.isDisabled = false;
    }

    AtivarBotaoSalvar(event: KeyboardEvent) {
        this.isDisabled2 = false;
    }

    modal_dados: any;

    async salvar() {
        let nome = document.querySelector("#inputNome") as HTMLIonInputElement;
        let email = document.querySelector("#inputEmail") as HTMLIonInputElement;

        if (nome.value != this.trabalhador.Nome) {
            if (nome.value == "") {
                nome.value = this.trabalhador.Nome;
            }
            else {
                let link = dominio + "/Trabalhador/AlterarDados";

                let trabalhador = JSON.parse(localStorage.getItem("trabalhador")!);
                let dadosForm = new FormData();

                dadosForm.append("cpf", trabalhador.Cpf);
                dadosForm.append("TipoDado", "Nome");
                dadosForm.append("Dado", nome.value?.toString()!);

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
        else if (email.value != this.trabalhador.Email) {
        }
    }

}
