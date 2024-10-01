import { Component, OnInit } from '@angular/core';
import { first, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';

@Component({
    selector: 'app-descricao-servico',
    templateUrl: './descricao-servico.page.html',
    styleUrls: ['./descricao-servico.page.scss'],
})
export class DescricaoServicoPage implements OnInit {
    carregar: boolean = false;
    servico: any;
    endereco: any;

    form = new FormGroup({
        descServico: new FormControl("", validadorDescricao()),
        endereco: new FormControl("")
    });

    erro: any = {
        descServico: "Descrição é obrigatória"
    };
    imgs: any = [];

    constructor(private http: HttpClient, private route: ActivatedRoute, private navCl: NavController) { }

    ngOnInit() {
        this.carregarServico();
        this.carregarEndereco();
    }

    ngAfterViewInit() {

    }

    ionViewDidEnter() {
        const label = document.querySelector("ion-textarea label") as HTMLLabelElement;

        this.form.controls['descServico'].statusChanges.subscribe(status => {
            if (status === "INVALID" && (this.form.controls['descServico'].touched || this.form.controls['descServico'].dirty)) {
                label.style.border = "1px solid red";
            }
            else {
                label.style.border = "none";
            }
        });
    }

    carregarServico() {
        const servico = JSON.parse(localStorage.getItem("servico")!);
        this.servico = servico;
    }

    async carregarEndereco() {
        let cliente = JSON.parse(localStorage.getItem("cliente")!);
        let link = "https://chow-master-properly.ngrok-free.app/Endereco/CarregarEndereco?cpf=" + cliente.Cpf;

        this.carregar = true;
        let resposta: any = await firstValueFrom(this.http.get(link));
        this.endereco = resposta;

        link = `https://viacep.com.br/ws/${this.endereco.Cep}/json/`;
        resposta = await firstValueFrom(this.http.get(link));
        this.carregar = false;

        this.endereco.Cep = {
            cep: this.endereco.Cep,
            bairro: resposta.bairro,
            rua: resposta.logradouro,
            estado: resposta.estado,
            cidade: resposta.localidade
        };

        this.form.controls['endereco'].disable();
        this.form.controls['endereco'].setValue(`${this.endereco.Cep.rua}, ${this.endereco.Numero}, ${this.endereco.Complemento == "" ? "" : this.endereco.Complemento + ","} ${this.endereco.Cep.bairro}, ${this.endereco.Cep.cidade} - ${this.endereco.Cep.estado}, ${this.endereco.Cep.cep.substring(0, 5) + "-" + this.endereco.Cep.cep.substring(5)}`);
    }

    voltarPag() {
        localStorage.removeItem("servico");

        this.navCl.back();
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

    checarInput(control: FormControl) {
        const label = document.querySelector("ion-textarea label") as HTMLLabelElement;

        if (control.invalid) {
            label.style.border = "1px solid red";
        }
        else {
            label.style.border = "none";
        }
    }

    async abrirFoto() {
        const imgArquivo = await Camera.getPhoto({
            quality: 90,
            allowEditing: true,
            resultType: CameraResultType.Uri
        });

        let resposta = await fetch(imgArquivo.webPath!);
        let blob = await resposta.blob();

        let arquivo = {
            src: imgArquivo.webPath,
            blob: blob
        };

        this.imgs.push(arquivo);
    }

    async enviarImgs() {
        let link = "https://chow-master-properly.ngrok-free.app/"

        for (let i = 0; i < this.imgs.length; i++)
        {

        }
    }

    enviar() {
        if (this.form.invalid) {
            this.checarInput(this.form.controls['descServico']);

            this.form.markAllAsTouched();
        }
        else {
            this.enviarImgs();
        }
    }
}

export function validadorTamanhoMinimo(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        let vl = control.value.replace(/[^/\d/ ]+/g, "");

        if (vl.length < 11) {
            return { tamanhoMinimo: { msg: "Cpf deve ter 11 dígitos!" } };
        }

        return null;
    };
};

export function validadorDescricao(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const textarea = document.querySelector("ion-textarea");

        let vl = control.value;

        if (vl == "") {
            return { obrigatorio: { msg: "Descrição é obrigatória!" } };
        }

        return null;
    };
};
