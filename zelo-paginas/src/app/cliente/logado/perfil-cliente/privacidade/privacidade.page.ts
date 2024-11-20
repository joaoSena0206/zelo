import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { ViewChild, ElementRef } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { NavController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { dominio, headerNgrok } from 'src/app/gerais';
import { first, firstValueFrom } from 'rxjs';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import validator from 'cpf-cnpj-validator';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Capacitor } from '@capacitor/core';
import { FilePicker } from '@capawesome/capacitor-file-picker';

@Component({
  selector: 'app-privacidade',
  templateUrl: './privacidade.page.html',
  styleUrls: ['./privacidade.page.scss'],
})
export class PrivacidadePage implements OnInit {

  cliente: any = JSON.parse(localStorage.getItem("cliente")!);
    novoTexto: any;
    isDisabled = true;
    isDisabled2 = true;
    cpf: any = this.cliente.Cpf;
    cpfFormatado: any;
    dominio = dominio;
    carregar: boolean = false;
    situacaoBotao: boolean = true;
    listaEndereco: any = JSON.parse(localStorage.getItem('endereco')!);
    
    form = new FormGroup({
        senhas: new FormGroup({
            Senha_Atual: new FormControl("", Validators.required),
            senha: new FormControl("", [Validators.required, validadorSenha()]),
            confirmarSenha: new FormControl("")
        }, validadorSenhaConfere()),
    });

    formDados = new FormGroup({
        Nome: new FormControl({ value: this.cliente.Nome, disabled: true }, [Validators.required]),
        email: new FormControl({ value: this.cliente.Email, disabled: true }, [Validators.required, Validators.email])
    });

    erro: any = {
        form: "",
        formDados: "",
        email: "Email obrigatório",
        senha: "Senha obrigatório",
        Senha_Atual: "Digite sua senha atual",
        Nome: "Nome obrigatório",
        identificacao: "Identificação obrigatório",
        cep: "Cep obrigatório",
        numero: "Numero obrigatório"
    };

    constructor(private fb: FormBuilder, private navCl: NavController, private http: HttpClient, private eRef: ElementRef, private toastController: ToastController, private sanitizer: DomSanitizer) {
      this.endereco.controls['estado'].disable();
      this.endereco.controls['cidade'].disable();
      this.endereco.controls['bairro'].disable();
      this.endereco.controls['rua'].disable();
     }

    ngOnInit() {
    }

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
        else if (control.hasError("email")) {
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
        this.navCl.navigateBack("/perfil")
    }

    ngAfterViewInit() {
        this.FormatarData();

        const inputs = document.querySelectorAll("ion-input");

        inputs.forEach((input: HTMLIonInputElement) => {
            input.addEventListener("ionBlur", function () {

                if (input.id != "senha" && input.id != "Senha_Atual" && input.id != "senhaNova" && input.id != "Identificacao" && input.id != "cep" && input.id != "numero") {
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
                if (input.id == "senha" || input.id == "Senha_Atual" || input.id == "senhaNova") {
                    input.style.border = 'black 1px solid';
                }
            });
        });

        inputs.forEach((input: HTMLIonInputElement) => {
            input.addEventListener("ionFocus", function () {
                if (input.id == "senha") {
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
        const dateString: string = this.cliente.DataNascimento;
        const timestamp: number = Date.parse(dateString);
        const date: Date = new Date(timestamp);

        let dia = date.getDate();
        let mes = date.getMonth() + 1;
        let ano = date.getFullYear();

        let DataFormatada = null;

        if (mes < 10 && dia < 10) {
            DataFormatada = "0" + dia + "/" + "0" + mes + "/" + ano;
        }
        else if(mes < 10){
          DataFormatada = dia + "/" + "0" + mes + "/" + ano;
        } else
        {
          DataFormatada = dia + "/" + mes + "/" + ano;
        }

        this.novoTexto = DataFormatada;
    }

    abilitarInput(inputElement: any) {
        let input = inputElement.parentElement.children[0] as HTMLIonInputElement;

        if (input.placeholder == "Nome") {
            this.formDados.controls['Nome'].enable();
        }
        else {
            this.formDados.controls['email'].enable();
        }

        input.style.border = 'black 1px solid';

        setTimeout(() => {
            input.setFocus();
        }, 100);
    }

    mostrarSpan: boolean = false;
    mostrarSpanSenha: boolean = false;
    situacao1: boolean = false;
    situacao2: boolean = false;
    situacao3: boolean = false;

    AtivarBotaoSalvar(event: KeyboardEvent) {
        if (this.formDados.invalid) {
            this.formDados.markAllAsTouched();
            this.situacao1 = true;
            this.isFormValid();
        }
        else {
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
        else {
            this.situacao2 = false;
            this.isFormValid();
        }
    }

    AtivarBotaoSalvar3(event: KeyboardEvent) {
      if (this.endereco.invalid) {
          this.endereco.markAllAsTouched();
          this.situacao3 = true;
          this.isFormValid();
      }
      else {
          this.situacao3 = false;
          this.isFormValid();
      }
    }

    isFormValid() {
        if (this.situacao1 == true) {
            this.situacaoBotao = true;
        }
        else {
            if (this.situacao2 == true) {
                this.situacaoBotao = true;
                this.mostrarSpanSenha = false;
            } else 
            if(this.situacao3 == true){
              this.situacaoBotao = true;
            }
            else{
                this.situacaoBotao = false;
                this.mostrarSpan = false;
                this.mostrarSpanSenha = false;
            }
        }
    }

    async salvar() {
        let nome = document.querySelector("#inputNome") as HTMLIonInputElement;
        let email = document.querySelector("#inputEmail") as HTMLIonInputElement;
        let Senha_Atual = document.querySelector("#Senha_Atual") as HTMLIonInputElement;
        let novaSenha = document.querySelector("#senhaNova") as HTMLIonInputElement;
        let dadosForm = new FormData();
        let link;

        if (novaSenha.value != "") {

            link = dominio + `/Cliente/VerificarSenha`;
            dadosForm.append("cpf", this.cliente.Cpf);
            dadosForm.append("senha", Senha_Atual.value?.toString()!);

            try {
                this.carregar = true;
                let resposta = await firstValueFrom(this.http.post(link, dadosForm, { responseType: 'text', headers: headerNgrok }));

                if (resposta == "1") {
                    link = dominio + "/Cliente/AlterarSenha";
                    dadosForm.append("cpf", this.cliente.Cpf);
                    dadosForm.append("novaSenha", novaSenha.value?.toString()!);

                    let resposta = await firstValueFrom(this.http.post(link, dadosForm, { headers: headerNgrok }));
                    this.showTemporaryToast();
                }
                else {
                    this.mostrarSpanSenha = true;
                    this.situacaoBotao = true;
                    return;
                }
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

        if(nome.value != this.cliente.Nome)
        {
            link = dominio + "/Cliente/AlterarEmail";
            let dadosForm = new FormData();
            dadosForm.append("cpf", this.cliente.Cpf);
            dadosForm.append("nome", nome.value?.toString()!);
            dadosForm.append("email", null!);

            try{
                let res2 = await firstValueFrom(this.http.post(link, dadosForm, { headers: headerNgrok }));
                this.cliente.Nome = nome.value;
                localStorage.setItem("cliente", JSON.stringify(this.cliente));
                this.showTemporaryToast();
            }
            catch (erro: any) {
                const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
                alert.message = "Erro ao conectar-se ao servidor";
                alert.present();
            }
        }

        if (email.value != this.cliente.Email) {

            let link = dominio + "/Cliente/ChecarExistencia";
            let dadosForm = new FormData();
            dadosForm.append("cpf", "Não Checar");
            dadosForm.append("email", email.value?.toString()!);

            try {
                this.carregar = true;
    
                let res = await firstValueFrom(this.http.post(link, dadosForm, { headers: headerNgrok }));
    
                this.carregar = false;
    
                let objRes = res as any;
    
                if (objRes.cadastrado.length == 0) {
                    localStorage.setItem('TrocaEmail', email.value?.toString()!);
                    this.navCl.navigateForward("/confirmar-celular");
                }
                else {
                    this.mostrarSpan = true;
                    this.situacaoBotao = true;
                }
            }
            catch 
            {
                const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
                alert.message = "Erro ao conectar-se ao servidor";
                alert.present();
            }
            finally 
            {
                this.carregar = false;
            }
        }

        let identificacao = document.querySelector('#Identificacao') as HTMLIonInputElement;
        let cep = document.querySelector('#cep') as HTMLIonInputElement;
        let numero = document.querySelector('#numero') as HTMLIonInputElement;
        let complemento = document.querySelector('#complemento') as HTMLIonInputElement;
        let referencia = document.querySelector('#referencia') as HTMLIonInputElement;

        if(identificacao.value != "" && cep.value != "" && numero.value != "")
        {

          if(complemento.value == "")
          {
            complemento.value = "-"
          }
          
          if(referencia.value == "")
          {
            referencia.value = "-"
          }

            link = dominio + "/Cliente/AlterarEndereco";
            let dadosForm = new FormData();

            dadosForm.append("cpf", this.cliente.Cpf);
            dadosForm.append("identificacao", identificacao.value?.toString()!);
            dadosForm.append("cep", cep.value?.toString()!);
            dadosForm.append("numero", numero.value?.toString()!);
            dadosForm.append("complemento", complemento.value?.toString()!);
            dadosForm.append("referencia", referencia.value?.toString()!);

            try{
                this.carregar = true;
                let res2 = await firstValueFrom(this.http.post(link, dadosForm));
                this.showTemporaryToast();
            }
            catch (erro: any) {
                const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
                alert.message = "Erro ao conectar-se ao servidor";
                alert.present();
            }
            finally 
            {
                this.carregar = false;
            }
        }

        this.situacaoBotao = true;
    }

    async showTemporaryToast() {
        const toast = await this.toastController.create({
          message: 'Dado(s) alterado com sucesso!',
          duration: 2000,
          position: 'top',
          cssClass: 'custom-toast',
        });
    
        await toast.present();
    }

    endereco = new FormGroup({
      identificacao: new FormControl("", Validators.required),
      cep: new FormControl("", [Validators.required, validadorTamanhoMinimo()]),
      estado: new FormControl(""),
      cidade: new FormControl(""),
      bairro: new FormControl(""),
      rua: new FormControl(""),
      numero: new FormControl("", Validators.required),
      complemento: new FormControl(""),
      pontoReferencia: new FormControl("")
    });

  readonly cepMask: MaskitoOptions = {
      mask: [/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/]
  };

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

  validarControl(control: FormControl) {
      let nome = this.acharNomeControl(control);

      if (control.hasError("required")) {
          this.erro[nome] = `${nome[0].toUpperCase() + nome.replace(nome[0], "")} obrigatório!`;
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

  buscarCep(cepControl: FormControl) {
      let cep = cepControl.value;

      if (cep.length == 9) {
          const link = `https://viacep.com.br/ws/${cep.replace("-", "")}/json/`;

          try {
              this.http.get(link).subscribe(res => {
                  let dados: any = res;

                  if (dados.erro == "true") {
                      this.endereco.controls['cep'].setErrors({ invalido: { msg: "Cep inválido" } });

                      this.validarControl(this.endereco.controls['cep']);
                  }

                  this.endereco.controls['estado'].setValue(dados.uf);
                  this.endereco.controls['cidade'].setValue(dados.localidade);
                  this.endereco.controls['bairro'].setValue(dados.bairro);
                  this.endereco.controls['rua'].setValue(dados.logradouro);
              });
          }
          catch {
              const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
              alert.message = "Erro ao puxar os dados do CEP";
              alert.present();
          }
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

export function validadorTamanhoMinimo(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
      let vl = control.value.replace(/[^/\d/ ]+/g, "");

      if (vl.length < 8) {
          return { tamanhoMinimo: { msg: "Cep deve ter 08 dígitos!" } };
      }

      return null;
  };
};