import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { dominio, headerNgrok } from 'src/app/gerais';

@Component({
    selector: 'app-login-trabalhador',
    templateUrl: './login-trabalhador.page.html',
    styleUrls: ['./login-trabalhador.page.scss'],
})
export class LoginTrabalhadorPage implements OnInit {

    form = new FormGroup({
        email: new FormControl("", [Validators.required, Validators.email]),
        senha: new FormControl("", Validators.required)
    });

    erro: any = {
        form: "",
        email: "Email obrigatório",
        senha: "Senha obrigatório"
    };

    carregar: boolean = false;

    constructor(private navCl: NavController, private http: HttpClient) { }

    ngOnInit() {
        localStorage.setItem("opcao", "login");
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
        this.navCl.navigateBack("home/opcoes-de-cadastro");
    }

    irCadastro() {
        this.navCl.navigateRoot("/cadastro-trabalhador");
    }

    async enviar() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
        }
        else {
            let link = dominio + "/Trabalhador/Logar";
            let email = this.form.controls['email'].value;
            let senha = this.form.controls['senha'].value;

            let dadosForm = new FormData();
            dadosForm.append("email", email!);
            dadosForm.append("senha", senha!);

            let res = null;
            
            try
            {
                this.carregar = true;
                res = await firstValueFrom(this.http.post(link, dadosForm, {headers:headerNgrok}));
            }
            catch{
                const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
                alert.message = "Erro ao conectar-se ao servidor";
                alert.present();
            }
            finally {
                this.carregar = false;
            }

            let obj: any = res;

            if (obj.erro != true) {
                let cliente = obj;

                localStorage.setItem("trabalhador", JSON.stringify(cliente));

                if (!cliente.Confirmado) {
                    this.navCl.navigateRoot("/confirmar-celular");
                }

                localStorage.setItem("logado", "true");
                localStorage.removeItem("opcao");

                this.navCl.navigateRoot("/trabalhador/inicial");
            }
            else {
                this.erro.form = "Email ou senha incorreto(s)";

                this.form.controls["email"].setErrors({ invalido: true });
                this.form.controls["senha"].setErrors({ invalido: true });
            }
        }
    }

}
