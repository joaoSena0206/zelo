import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { Renderer2 } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { cpf } from 'cpf-cnpj-validator';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-cadastro-trabalhador',
    templateUrl: './cadastro-trabalhador.page.html',
    styleUrls: ['./cadastro-trabalhador.page.scss'],
})
export class CadastroTrabalhadorPage implements OnInit {
    form = new FormGroup({
        nome: new FormControl("", Validators.required),
        cpf: new FormControl("", [Validators.required, validadorTamanhoMinimo(), validadorCpf()]),
        data: new FormControl("", [Validators.required, validadorIdade()]),
        email: new FormControl("", [Validators.required, Validators.email]),
        celular: new FormControl("", [Validators.required, validadorCel()]),
        senhas: new FormGroup({
            senha: new FormControl("", [Validators.required, validadorSenha()]),
            confirmarSenha: new FormControl("")
        }, validadorSenhaConfere()),
        termos: new FormControl("", validadorTermos())
    });
    

    inputData: any;
    erro: any = {
        nome: "Nome obrigatório!",
        cpf: "Cpf obrigatório!",
        data: "Data obrigatório!",
        email: "Email obrigatório!",
        celular: "Celular obrigatório!",
        senha: "Senha obrigatório!"
    };
    nomeClass: any = "form__input";
    quadradoSrc: any = "../../../assets/icon/cliente/quadrado.svg";

    regexNome: RegExp = /[^a-zA-Zà-úÀ-úçÇñÑ_ ]+/g;

    readonly cpfMask: MaskitoOptions = {
        mask: [/\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, "-", /\d/, /\d/]
    };

    readonly celMask: MaskitoOptions = {
        mask: ["(", /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/]
    };

    readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

    constructor(private renderer: Renderer2, private navCl: NavController, private http: HttpClient) {

    }

    ngOnInit() {

    }

    ngAfterViewInit() {

    }

    ionViewWillEnter() {
        if (localStorage.getItem("trabalhador")) {
            if (this.form.controls['cpf'].value == "") {
                let Trabalhador = JSON.parse(localStorage.getItem("trabalhador")!);

                this.form.controls['nome'].setValue(Trabalhador.nome);
                this.form.controls['cpf'].setValue(Trabalhador.cpf);
                this.form.controls['data'].setValue(Trabalhador.dataNascimento);
                this.form.controls['email'].setValue(Trabalhador.email);
                this.form.controls['senhas'].controls['senha'].setValue(Trabalhador.senha);
                this.form.controls['senhas'].controls['confirmarSenha'].setValue(Trabalhador.senha);

                this.mostrarData();
            }
        }
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
                    this.erro[nome] = erros[erro].msg;
                });
            }
            else
            {
                this.erro[nome] = "";
            }
        }
    }

    mostrarData() {
        let data = this.form.controls['data'].value;

        if (data != null && data != "") {
            let date = new Date(data);
            this.inputData = date.toLocaleDateString();
        }
    }

    checarCadastro(trabalhador: any, dado: string = "padrão") {
        let link = "https://chow-master-properly.ngrok-free.app/Trabalhador/Adicionar";
        let dadosForm = new FormData();
        dadosForm.append("cpf", trabalhador.cpf!);
        dadosForm.append("email", trabalhador.email!);

        if (dado != "padrão")
        {
            dadosForm.set(dado, "null");
        }

        this.http.post(link, dadosForm).subscribe(res => {
            let objRes = res as any;

            if (objRes.cadastrado.length == 0) {
                localStorage.setItem("trabalhador", JSON.stringify(trabalhador));
            }
            else {
                objRes.cadastrado.forEach((cadastrado: keyof typeof this.form.controls = 'nome') => {
                    this.erro[cadastrado] = cadastrado[0].toUpperCase() + cadastrado.replace(cadastrado[0], "") + " já cadastrado!";

                    this.form.controls[cadastrado].setErrors({ existe: true });
                    this.form.controls[cadastrado].markAsDirty();
                });
            }
        });
    }

    enviar() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
        }
        else {
            console.log("foi");

            let Trabalhador = {
                cpf: this.form.controls['cpf'].value?.replace(/\./g, "").replace("-", ""),
                nome: this.form.controls['nome'].value,
                dataNascimento: this.form.controls['data'].value?.substring(0, 10),
                email: this.form.controls['email'].value,
                senha: this.form.controls['senhas'].controls['senha'].value,
                pix: null,
                disponivel: false,
            };

            if (localStorage.getItem("trabalhador")) {
                let trabalhadorStorage = JSON.parse(localStorage.getItem("trabalhador")!);

                if (Trabalhador.cpf != trabalhadorStorage.cpf && Trabalhador.email != trabalhadorStorage.email) {
                    this.checarCadastro(Trabalhador);
                }
                else if (Trabalhador.cpf != trabalhadorStorage.cpf)
                {
                    this.checarCadastro(Trabalhador, "email");
                }
                else if (Trabalhador.email != trabalhadorStorage.email)
                {
                    this.checarCadastro(Trabalhador, "cpf");
                }
                else if (this.form.dirty)
                {
                    localStorage.setItem("trabalhador", JSON.stringify(Trabalhador));
                }
            }
            else {
                this.checarCadastro(Trabalhador);
            }


            /* this.http.post('http://localhost:57879/Trabalhador/Adicionar', JSON.stringify(Trabalhador)).subscribe(res => {
                console.log(res);
            }) */
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

export function validadorCel(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        let cel = control.value.replace(/[^/\d/]+/g, "");

        if (cel.length < 11) {
            return { celTamanho: { msg: 'O celular deve ter 9 dígitos, fora o DD!' } };
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

