import { Component, input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { dominio, headerNgrok } from 'src/app/gerais';

@Component({
    selector: 'app-confirmar-celular-trabalhador',
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

    constructor(private navCl: NavController, private http: HttpClient) { }

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

    gerarCodigo(event: any) {
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
        let trabalhador = JSON.parse(localStorage.getItem("trabalhador")!);

        let dadosForm = new FormData();
        dadosForm.append("cpf", trabalhador.Cpf);
        dadosForm.append("tipo", "trabalhador");

        this.http.post(link, dadosForm, {headers:headerNgrok}).subscribe(res => {
            let resposta: any = res;

            if (resposta.res == "ok") {
                this.codigoAleatorio = resposta.codigo;
            }
        });
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
                let link = dominio + "/Trabalhador/ConfirmarEmail";
                let trabalhador = JSON.parse(localStorage.getItem("trabalhador")!);
                let dadosForm = new FormData();
                dadosForm.append("cpf", trabalhador.Cpf);

                this.carregar = true;

                let res: any = await firstValueFrom(this.http.post(link, dadosForm, { responseType: "text", headers:headerNgrok }));

                if (res == "ok") {
                    link = dominio + "/Trabalhador/AdicionarFotoPerfil";

                    res = await firstValueFrom(this.http.post(link, dadosForm, {headers:headerNgrok}));

                    if (res == null) {
                        this.navCl.navigateRoot("/tipo-saque");
                    }
                }

                this.carregar = false;
            }
        }
    }
}
