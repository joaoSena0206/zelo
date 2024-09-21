import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MaskitoOptions, MaskitoElementPredicate, maskitoTransform } from '@maskito/core';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-tipo-saque',
    templateUrl: './tipo-saque.page.html',
    styleUrls: ['./tipo-saque.page.scss'],
})
export class TipoSaquePage implements OnInit {
    form = new FormGroup({
        pix: new FormControl("", Validators.required),
        valor: new FormControl("", Validators.required)
    });

    erro: any = {
        pix: "Pix obrigatório!",
        valor: "Valor obrigatório!"
    };

    constructor(private navCl: NavController) { }

    ngOnInit() {
    }

    ngAfterViewInit()
    {
        if (localStorage.getItem("trabalhador"))
        {
            let trabalhador = JSON.parse(localStorage.getItem("trabalhador")!);
            this.form.controls['pix'].setValue(trabalhador.pix);
            this.form.controls['valor'].setValue(trabalhador.valor);    
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

    voltarPag() {
        this.navCl.back();
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

    filtroInput(input: HTMLIonInputElement) {
        input.value = input.value?.toString().replace(/[^0-9.,]+|(?<=\.\d{2})\d+|(?<=,\d{2})\d+/g, "");
    }

    enviar() {
        let txtPix = document.querySelector("#txtPix") as HTMLIonInputElement;
        let txtValor = document.querySelector("#txtValor") as HTMLIonInputElement;

        if (this.form.invalid) {
            this.form.markAllAsTouched();
        }
        else {
            if (localStorage.getItem("trabalhador")) {

                let trabalhadorStorage = JSON.parse(localStorage.getItem("trabalhador")!);
                trabalhadorStorage.pix = this.form.controls['pix'].value;
                trabalhadorStorage.valor = this.form.controls['valor'].value?.replace(",", ".");

                localStorage.setItem("trabalhador", JSON.stringify(trabalhadorStorage));

                this.navCl.navigateForward("/categoria");
            }
        }
    }

}
