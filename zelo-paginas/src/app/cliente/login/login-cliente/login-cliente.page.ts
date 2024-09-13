import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular'; 

@Component({
	selector: 'app-login-cliente',
	templateUrl: './login-cliente.page.html',
	styleUrls: ['./login-cliente.page.scss'],
})
export class LoginClientePage implements OnInit {
	form = new FormGroup({
		email: new FormControl("", [Validators.required, Validators.email]),
		senha: new FormControl("", Validators.required)
	});

	erro: any = {
		email: "Email obrigatório",
		senha: "Senha obrigatório"
	};

	constructor(private navCl: NavController) { }

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

	voltarPag()
	{
		this.navCl.navigateBack("home/opcoes-de-cadastro");
	}

	irCadastro()
	{
		this.navCl.navigateRoot("/cadastro-cliente");
	}

	enviar()
	{
		if (this.form.invalid)
		{
			this.form.markAllAsTouched();
		}
		else
		{
			
		}
	}

}
