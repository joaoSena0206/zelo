import { Component, input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { first, firstValueFrom } from 'rxjs';
import { dominio } from 'src/app/gerais';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
    selector: 'app-confirmar-celular',
    templateUrl: './confirmar-celular.page.html',
    styleUrls: ['./confirmar-celular.page.scss'],
})
export class ConfirmarCelularPage implements OnInit {
    tempo: number = 60;
    erro: string = "Código obrigatório!";
    form = new FormGroup({
        input1: new FormControl("", Validators.required),
        input2: new FormControl("", Validators.required),
        input3: new FormControl("", Validators.required),
        input4: new FormControl("", Validators.required),
        input5: new FormControl("", Validators.required)
    });
    codigoAleatorio: string;
    carregar: boolean = false;

    constructor(private navCl: NavController, private http: HttpClient, private toastController: ToastController, private router: Router) { }

    ngOnInit() {

    }

    ngAfterViewInit() {
        const inputs = document.querySelectorAll("ion-input");

        for (let i = 0; i < inputs.length; i++) {
            let todosPreenchidos = false;

            inputs[i].addEventListener("ionInput", function () {
                let apagado = false;

                if (/[^\d]/g.test(inputs[i].value?.toString()!)) {
                    apagado = true;
                }

                inputs[i].value = inputs[i].value?.toString().replace(/[^\d]/g, "");

                if (inputs[i].value != "" && i != inputs.length - 1 && apagado == false) {
                    inputs[i + 1].setFocus();
                }
                else if (inputs[i].value == "" && i != 0 && apagado == false) {
                    inputs[i - 1].setFocus();
                }
            });
        }
    }

    ionViewDidEnter() {
        const btns = document.querySelectorAll(".form__btn");
        const btnReenviar = document.querySelector(".form__btn--reenviar");

        if ((btns[0] as HTMLIonButtonElement).offsetHeight != (btns[1] as HTMLIonButtonElement).offsetHeight) {
            (btns[0] as HTMLIonButtonElement).style.height = (btns[1] as HTMLIonButtonElement).offsetHeight + "px";
        }

        window.addEventListener("resize", function () {
            const btns = document.querySelectorAll(".form__btn");

            if ((btns[0] as HTMLIonButtonElement).offsetHeight != (btns[1] as HTMLIonButtonElement).offsetHeight) {
                (btns[0] as HTMLIonButtonElement).style.height = (btns[1] as HTMLIonButtonElement).offsetHeight + "px";
            }
        });

        const intervalo = setInterval(() => {
            this.tempo -= 1;

            if (this.tempo == 0) {
                clearInterval(intervalo);
            }
        }, 1000);

        this.gerarCodigo(null);
    }

    ionViewDidLeave() {
        const nextUrl = this.router.url;

        if (nextUrl === '/privacidade') {
            this.showTemporaryToast();
        }
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

    async gerarCodigo(event: any) {
        if (event != null) {
            this.tempo = 60;

            const intervalo = setInterval(() => {
                this.tempo -= 1;

                if (this.tempo == 0) {
                    clearInterval(intervalo);
                }
            }, 1000);
        }

        let link = dominio + "/Confirmacao/GerarCodigo";
        let cliente = JSON.parse(localStorage.getItem("cliente")!);
        let emailTroca = localStorage.getItem("TrocaEmail")!;

        let dadosForm = new FormData();
        dadosForm.append("cpf", cliente.Cpf);
        dadosForm.append("tipo", "cliente");

        if (localStorage.getItem("TrocaEmail") !== null) {
            dadosForm.append("trocarEmail", emailTroca);
        } 
        else {
            dadosForm.append("trocarEmail", null!);
        }

        try {
            let res = await firstValueFrom(this.http.post(link, dadosForm));

            let resposta: any = res;

            if (resposta.res == "ok") {
                this.codigoAleatorio = resposta.codigo;
            }
        }
        catch {
            const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
            alert.message = "Erro ao conectar-se ao servidor";
            alert.present();
        }
    }

    async enviar() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
        }
        else {
            let codigo = "";
            codigo += this.form.controls["input1"].value;
            codigo += this.form.controls["input2"].value;
            codigo += this.form.controls["input3"].value;
            codigo += this.form.controls["input4"].value;
            codigo += this.form.controls["input5"].value;

            if (codigo == this.codigoAleatorio) {
                let link = dominio + "/Cliente/ConfirmarEmail";
                let cliente = JSON.parse(localStorage.getItem("cliente")!);
                let dadosForm = new FormData();
                dadosForm.append("cpf", cliente.Cpf);

                try {
                    this.carregar = true;

                    let res: any = await firstValueFrom(this.http.post(link, dadosForm, { responseType: "text" }));

                    link = dominio + "/Cliente/AdicionarFotoPerfil";

                    res = await firstValueFrom(this.http.post(link, dadosForm));

                    if (localStorage.getItem("TrocaEmail") !== null) {
                        let emailTrocado = localStorage.getItem("TrocaEmail");
                        localStorage.removeItem("TrocaEmail");

                        link = dominio + "/Cliente/AlterarEmail";
                        let dadosForm = new FormData();
                        dadosForm.append("cpf", cliente.Cpf);
                        dadosForm.append("nome", null!);
                        dadosForm.append("email", emailTrocado!);

                        try{
                            let res2 = await firstValueFrom(this.http.post(link, dadosForm));
                            cliente.Email = emailTrocado;
                            localStorage.setItem("cliente", JSON.stringify(cliente));
                            this.navCl.navigateRoot("/privacidade");
                        }
                        catch (erro: any) {
                            const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
                            alert.message = "Erro ao conectar-se ao servidor";
                            alert.present();
                        }

                    } 
                    else {
                        this.navCl.navigateRoot("/endereco", { animated: true, animationDirection: 'forward' });
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
        }
    }
}
