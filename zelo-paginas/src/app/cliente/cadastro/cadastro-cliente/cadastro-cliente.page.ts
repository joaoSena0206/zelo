import { Component, OnInit } from '@angular/core';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { cpf } from 'cpf-cnpj-validator';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { firstValueFrom } from 'rxjs';
import { dominio } from 'src/app/gerais';

@Component({
    selector: 'app-cadastro-cliente',
    templateUrl: './cadastro-cliente.page.html',
    styleUrls: ['./cadastro-cliente.page.scss'],
})
export class CadastroClientePage implements OnInit {
    form = new FormGroup({
        nome: new FormControl("", Validators.required),
        cpf: new FormControl("", [Validators.required, validadorTamanhoMinimo(), validadorCpf()]),
        data: new FormControl("", [Validators.required, validadorIdade()]),
        email: new FormControl("", [Validators.required, Validators.email]),
        senhas: new FormGroup({
            senha: new FormControl("", [Validators.required, validadorSenha()]),
            confirmarSenha: new FormControl("")
        }, validadorSenhaConfere()),
        termos: new FormControl("", validadorTermos())
    });

    carregar: boolean = false;
    inputData: any;
    erro: any = {
        nome: "Nome obrigatório!",
        cpf: "Cpf obrigatório!",
        data: "Data obrigatório!",
        email: "Email obrigatório!",
        senha: "Senha obrigatório!"
    };
    nomeClass: any = "form__input";
    quadradoSrc: any = "../../../assets/icon/cliente/quadrado.svg";

    regexNome: RegExp = /[^a-zA-Zà-úÀ-úçÇñÑ_ ]+/g;

    readonly cpfMask: MaskitoOptions = {
        mask: [/\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, "-", /\d/, /\d/]
    };

    readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

    constructor(private router: Router, private navCl: NavController, private http: HttpClient) {

    }

    ngOnInit() {
        localStorage.setItem("opcao", "cadastro");
    }

    ionViewWillEnter() {

    }

    pagAnterior() {
        this.navCl.navigateBack("/home/opcoes-de-cadastro");
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

    marcarQuadrado() {
        if (this.quadradoSrc == "../../../assets/icon/cliente/quadrado.svg") {
            this.form.controls['termos'].setValue("marcado");

            this.quadradoSrc = "../../../assets/icon/cliente/quadrado_marcado.svg";
            this.form.controls['termos'].markAsUntouched();
        }
        else {
            this.form.controls['termos'].setValue("");

            this.quadradoSrc = "../../../assets/icon/cliente/quadrado.svg";
            this.form.controls['termos'].markAsUntouched();
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

        return controlName;
    }

    validacaoInput(control: FormControl) {
        let nome = this.acharNomeControl(control);
        let vlControl = control.value as String;

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

    mostrarData() {
        let data = this.form.controls['data'].value;
        this.inputData = moment(data).format("DD/MM/YYYY");
    }

    async checarCadastro(cliente: any, dado: string = "padrão") {
        let link = dominio + "/Cliente/ChecarExistencia";
        let dadosForm = new FormData();
        dadosForm.append("cpf", cliente.Cpf!);
        dadosForm.append("email", cliente.Email!);

        if (dado != "padrão") {
            dadosForm.set(dado, "null");
        }

        try {
            this.carregar = true;
            let resposta: any = await firstValueFrom(this.http.post(link, dadosForm));

            let objRes = resposta as any;

            if (objRes.cadastrado.length == 0) {
                link = dominio + "/Cliente/Adicionar";
                dadosForm = new FormData();
                dadosForm.append("cliente", JSON.stringify(cliente));

                resposta = await firstValueFrom(this.http.post(link, dadosForm, { responseType: "text" }));

                localStorage.setItem("cliente", JSON.stringify(cliente));

                this.navCl.navigateRoot("/confirmar-celular", { animationDirection: "forward", animated: true });
            }
            else {
                objRes.cadastrado.forEach((cadastrado: keyof typeof this.form.controls = 'nome') => {
                    this.erro[cadastrado] = cadastrado[0].toUpperCase() + cadastrado.replace(cadastrado[0], "") + " já cadastrado!";

                    this.form.controls[cadastrado].setErrors({ existe: true });
                    this.form.controls[cadastrado].markAsDirty();
                });
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

    enviar() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
        }
        else {
            let cliente = {
                Cpf: this.form.controls['cpf'].value?.replace(/\./g, "").replace("-", ""),
                Nome: this.form.controls['nome'].value,
                DataNascimento: this.form.controls['data'].value?.substring(0, 10),
                Email: this.form.controls['email'].value,
                Senha: this.form.controls['senhas'].controls['senha'].value,
            };

            this.checarCadastro(cliente);
        }
    }
}

export function validadorCpf(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        let vl = control.value.replace(/\./g, "").replace("-", "");

        if (vl.length == 11) {
            if (!cpf.isValid(vl)) {
                return { invalido: { msg: "CPF inválido!" } };
            }

            return null;
        }

        return null;
    };
};

export function validadorTamanhoMinimo(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        let vl = control.value.replace(/[^/\d/ ]+/g, "");

        if (vl.length < 11) {
            return { tamanhoMinimo: { msg: "Cpf deve ter 11 dígitos!" } };
        }

        return null;
    };
};

export function validadorIdade(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        let dataAtual = new Date();
        let dataNascimento = new Date(control.value);

        let idade = dataAtual.getFullYear() - dataNascimento.getFullYear();

        if (dataAtual.getDate() < dataNascimento.getDate() && dataAtual.getMonth() + 1 <= dataNascimento.getMonth() + 1) {
            idade -= 1;
        }

        if (idade < 18) {
            return { idade: { msg: "Deve ser maior que 18 anos!" } };
        }

        return null;
    };
};

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

export function validadorTermos(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        let termo = control.value;

        if (termo != "marcado") {
            return { marcado: { msg: "Aceite os termos!" } };
        }

        return null;
    };
};
