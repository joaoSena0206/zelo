import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MaskitoOptions, MaskitoElementPredicate } from '@maskito/core';
import { NavController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-endereco',
    templateUrl: './endereco.page.html',
    styleUrls: ['./endereco.page.scss'],
})
export class EnderecoPage implements OnInit {
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

    carregar: boolean = false;

    readonly cepMask: MaskitoOptions = {
        mask: [/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/]
    };

    readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

    erro: any = {
        identificacao: "Identificação obrigatório",
        cep: "Cep obrigatório",
        numero: "Numero obrigatório"
    };

    constructor(private http: HttpClient, private navCl: NavController) {
        this.endereco.controls['estado'].disable();
        this.endereco.controls['cidade'].disable();
        this.endereco.controls['bairro'].disable();
        this.endereco.controls['rua'].disable();
    }

    ngOnInit() {
    }

    acharNomeControl(control: FormControl) {
        let controlName = "";

        Object.keys(this.endereco.controls).forEach(item => {

            if (this.endereco.get(item) === control) {
                controlName = item;
            }
        });

        return controlName;
    }

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
    }

    async enviar() {
        if (this.endereco.invalid) {
            this.endereco.markAllAsTouched();
        }
        else {
            let link = "https://chow-master-properly.ngrok-free.app/Endereco/AdicionarEndereco";
            let cliente = JSON.parse(localStorage.getItem("cliente")!);
            let endereco = {
                CpfCliente: cliente.Cpf,
                Identificacao: this.endereco.controls['identificacao'].value,
                Cep: this.endereco.controls['cep'].value?.replace("-", ""),
                Numero: this.endereco.controls['numero'].value,
                Complemento: this.endereco.controls['complemento'].value,
                Referencia: this.endereco.controls['pontoReferencia'].value
            };

            let dadosForm = new FormData();
            dadosForm.append("endereco", JSON.stringify(endereco));

            this.carregar = true;

            let res = await firstValueFrom(this.http.post(link, dadosForm));

            this.carregar = false;

            if (res == null) {
                this.navCl.navigateRoot("/login-cliente", { animated: true, animationDirection: "forward" });
            }
        }
    }
}


export function validadorTamanhoMinimo(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        let vl = control.value.replace(/[^/\d/ ]+/g, "");

        if (vl.length < 8) {
            return { tamanhoMinimo: { msg: "Cep deve ter 08 dígitos!" } };
        }

        return null;
    };
};
