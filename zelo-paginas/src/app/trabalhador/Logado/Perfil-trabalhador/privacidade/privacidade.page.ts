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
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { CropperComponent } from 'angular-cropperjs';

@Component({
    selector: 'app-privacidade',
    templateUrl: './privacidade.page.html',
    styleUrls: ['./privacidade.page.scss'],
})
export class PrivacidadePage implements OnInit {
    @ViewChild('angularCropper') public angularCropper: CropperComponent;

    trabalhador: any = JSON.parse(localStorage.getItem("trabalhador")!);
    novoTexto: any;
    isDisabled = true;
    isDisabled2 = true;
    cpf: any = this.trabalhador.Cpf;
    cpfFormatado: any;
    dominio = dominio;
    carregar: boolean = false;
    situacaoBotao: boolean = true;
    fotoPerfil: any;
    config: any = {
        aspectRatio: 1,
        movable: true,
        zoomable: true,
        scalable: true,
        viewMode: 1,
        cropBoxResizable: false,
        autoCropArea: 1,
        minCropBoxWidth: 140,
        minCropBoxHeight: 140
    };
    perfilFoto: any = dominio + '/Imgs/Perfil/Trabalhador/' + this.trabalhador.Cpf + '.jpg?time=' + new Date().getTime();

    form = new FormGroup({
        senhas: new FormGroup({
            Senha_Atual: new FormControl("", Validators.required),
            senha: new FormControl("", [Validators.required, validadorSenha()]),
            confirmarSenha: new FormControl("")
        }, validadorSenhaConfere()),
    });

    formDados = new FormGroup({
        Nome: new FormControl({ value: this.trabalhador.Nome, disabled: true }, [Validators.required]),
        email: new FormControl({ value: this.trabalhador.Email, disabled: true }, [Validators.required, Validators.email])
    });

    erro: any = {
        form: "",
        formDados: "",
        email: "Email obrigatório",
        senha: "Senha obrigatório",
        Senha_Atual: "Digite sua senha atual",
        Nome: "Nome obrigatório"
    };
    situacao4: any;

    constructor(private fb: FormBuilder, private navCl: NavController, private http: HttpClient, private eRef: ElementRef, private toastController: ToastController, private sanitizer: DomSanitizer) { }

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

    async pegarFoto(div: any) {
        div.style.display = "flex";

        const img = await Camera.getPhoto({
            quality: 90,
            resultType: CameraResultType.DataUrl,
            source: CameraSource.Photos
        });

        this.fotoPerfil = img.dataUrl;
    }

    recortarImg() {
        const imgCrop = this.angularCropper.cropper.getCroppedCanvas({
            width: 140,
            height: 140
        }).toDataURL("image/jpeg");

        this.perfilFoto = imgCrop;

        this.situacao4 = false;
        this.isFormValid();
    }

    fecharDiv(div: any) {
        div.style.display = "none";
    }

    // Converte Base64 para FormData
    private base64ToFormData(base64String: string, fileName: string): FormData {
        // Remove o prefixo (se existir)
        const base64Data = base64String.includes(',')
            ? base64String.split(',')[1]
            : base64String;

        // Converter Base64 para array de bytes
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) =>
            byteCharacters.charCodeAt(i)
        );
        const byteArray = new Uint8Array(byteNumbers);

        // Criar um Blob
        const blob = new Blob([byteArray], { type: 'application/octet-stream' });

        // Adicionar ao FormData
        const formData = new FormData();
        formData.append('file', blob, fileName);

        return formData;
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
        this.navCl.navigateRoot("/trabalhador/perfil")
    }

    ngAfterViewInit() {
        this.FormatarData();

        const inputs = document.querySelectorAll("ion-input");

        inputs.forEach((input: HTMLIonInputElement) => {
            input.addEventListener("ionBlur", function () {

                if (input.id != "senha" && input.id != "Senha_Atual" && input.id != "senhaNova") {
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

    isFormValid() {
        if (this.situacao1 == true) {
            this.situacaoBotao = true;
        }
        else {
            if (this.situacao2 == true) {
                this.situacaoBotao = true;
                this.mostrarSpanSenha = false;
            }
            else {
                if (this.situacao4 == true) {
                    this.situacaoBotao = true;
                }
                else {
                    this.situacaoBotao = false;
                    this.mostrarSpan = false;
                    this.mostrarSpanSenha = false;
                }
            }
        }
    }

    async uploadFile(base64String: string, fileName: string) {
        let link = dominio + "/Trabalhador/AdicionarFotoPerfil";
        const formData = this.base64ToFormData(base64String, fileName);
        formData.append("cpf", this.trabalhador.Cpf);

        this.carregar = true;
        await firstValueFrom(this.http.post(link, formData));
        this.carregar = false;
    }

    async salvar() {
        let nome = document.querySelector("#inputNome") as HTMLIonInputElement;
        let email = document.querySelector("#inputEmail") as HTMLIonInputElement;
        let Senha_Atual = document.querySelector("#Senha_Atual") as HTMLIonInputElement;
        let novaSenha = document.querySelector("#senhaNova") as HTMLIonInputElement;
        let trabalhador = JSON.parse(localStorage.getItem("trabalhador")!);
        let dadosForm = new FormData();
        let link;

        if (novaSenha.value != "") {

            link = dominio + `/Trabalhador/VerificarSenha`;
            dadosForm.append("cpf", trabalhador.Cpf);
            dadosForm.append("senha", Senha_Atual.value?.toString()!);

            try {
                this.carregar = true;
                let resposta = await firstValueFrom(this.http.post(link, dadosForm, { responseType: 'text', headers: headerNgrok }));

                if (resposta == "1") {
                    link = dominio + "/Trabalhador/AlterarSenha";
                    dadosForm.append("cpf", trabalhador.Cpf);
                    dadosForm.append("novaSenha", novaSenha.value?.toString()!);

                    let resposta = await firstValueFrom(this.http.post(link, dadosForm, { headers: headerNgrok }));
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

        if (nome.value != trabalhador.Nome) {
            link = dominio + "/Trabalhador/AlterarEmail";
            let dadosForm = new FormData();
            dadosForm.append("cpf", trabalhador.Cpf);
            dadosForm.append("nome", nome.value?.toString()!);
            dadosForm.append("email", null!);

            try {
                let res2 = await firstValueFrom(this.http.post(link, dadosForm, { headers: headerNgrok }));
                trabalhador.Nome = nome.value;
                localStorage.setItem("trabalhador", JSON.stringify(trabalhador));
            }
            catch (erro: any) {
                const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
                alert.message = "Erro ao conectar-se ao servidor";
                alert.present();
            }
        }

        if (email.value != trabalhador.Email) {

            let link = dominio + "/Trabalhador/ChecarExistencia";
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
                    this.navCl.navigateForward("/trabalhador/confirmar-celular");
                }
                else {
                    this.mostrarSpan = true;
                    this.situacaoBotao = true;
                }
            }
            catch {
                const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
                alert.message = "Erro ao conectar-se ao servidor";
                alert.present();
            }
            finally {
                this.carregar = false;
            }
        }

        try {
            this.uploadFile(this.perfilFoto, this.trabalhador.Cpf + ".jpg");
        }
        catch {
            const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
            alert.message = "Erro ao conectar-se ao servidor";
            alert.present();
        }

        this.situacaoBotao = true;
        this.showTemporaryToast();
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

    arquivos: any = [];
    imgSrc: any;

    abrirArquivo() {
        const pegarArquivos = async () => {
            const resultado = await FilePicker.pickFiles({
                types: ['image/png', 'image/jpeg', 'application/pdf'],
                limit: 1
            });
            const arquivo = resultado.files[0];
            let caminho = Capacitor.convertFileSrc(arquivo.path!);
            let resposta = await fetch(caminho);
            let arquivoBlob = await resposta.blob();

            interface objSafeUrl {
                id: any,
                arquivo: any,
                img: any,
                pdf: any
            }

            let obj: objSafeUrl = {
                id: null,
                arquivo: null,
                img: null,
                pdf: null
            };

            obj.arquivo = arquivo;

            if (arquivoBlob) {
                const reader = new FileReader();

                reader.onload = (e: any) => {
                    if (arquivoBlob.type == "image/png" || arquivoBlob.type == "image/jpeg") {
                        obj.img = e.target.result;
                    }
                    else {
                        obj.pdf = this.sanitizer.bypassSecurityTrustResourceUrl(e.target.result)!;
                    }
                };

                reader.readAsDataURL(arquivoBlob);
            }

            this.arquivos.push(obj)
        };

        pegarArquivos();
    }

    removerArquivo(event: any) {
        let nomeArquivo = event.parentElement.children[0].children[1].textContent;

        for (let i = 0; i < this.arquivos.length; i++) {
            if (nomeArquivo == this.arquivos[i].arquivo.name) {
                this.arquivos.splice(i, 1);
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