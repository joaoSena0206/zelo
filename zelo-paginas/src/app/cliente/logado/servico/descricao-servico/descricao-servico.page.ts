import { Component, OnInit } from '@angular/core';
import { first, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { dominio, headerNgrok } from 'src/app/gerais';

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

        if (!localStorage.getItem("solicitacao")) {
            this.carregarEndereco();
        }
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

        if (localStorage.getItem("solicitacao")) {
            let solicitacao = JSON.parse(localStorage.getItem("solicitacao")!);
            let endereco = localStorage.getItem("endereco");

            this.form.controls['endereco'].setValue(endereco);
            this.form.controls['endereco'].disable();
            this.form.controls['descServico'].setValue(solicitacao.dsServico);
        }
    }

    carregarServico() {
        const servico = JSON.parse(localStorage.getItem("servico")!);
        this.servico = servico;
    }

    async carregarEndereco() {
        let cliente = JSON.parse(localStorage.getItem("cliente")!);
        let link = dominio + "/Endereco/CarregarEndereco?cpf=" + cliente.cpf;

        try {
            this.carregar = true;
            let resposta: any = await firstValueFrom(this.http.get(link, { headers: headerNgrok }));
            this.endereco = resposta;

            link = `https://viacep.com.br/ws/${this.endereco.cep}/json/`;
            resposta = await firstValueFrom(this.http.get(link));

            this.endereco.cep = {
                cep: this.endereco.cep,
                bairro: resposta.bairro,
                rua: resposta.logradouro,
                estado: resposta.estado,
                cidade: resposta.localidade
            };

            this.form.controls['endereco'].disable();
            this.form.controls['endereco'].setValue(`${this.endereco.cep.rua}, ${this.endereco.numero}, ${this.endereco.complemento == "" ? "" : this.endereco.complemento + ","} ${this.endereco.cep.bairro}, ${this.endereco.cep.cidade} - ${this.endereco.cep.estado}, ${this.endereco.cep.cep.substring(0, 5) + "-" + this.endereco.cep.cep.substring(5)}`);
            localStorage.setItem("endereco", this.form.controls['endereco'].value!);
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

    voltarPag() {
        localStorage.removeItem("servico");
        localStorage.removeItem("endereco");
        localStorage.removeItem("solicitacao");

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
            allowEditing: false,
            resultType: CameraResultType.Uri
        });

        let resposta = await fetch(imgArquivo.webPath!);
        let blob = await resposta.blob();
        let file = new File([blob], "img." + blob.type.substring(blob.type.indexOf("/") + 1), { type: "image/jpeg" });

        let arquivo = {
            src: imgArquivo.webPath,
            blob: file
        };

        this.imgs.push(arquivo);
    }

    async enviar() {
        if (this.form.invalid) {
            this.checarInput(this.form.controls['descServico']);

            this.form.markAllAsTouched();
        }
        else {
            if (!localStorage.getItem("solicitacao")) {
                let link = dominio + "/SolicitacaoServico/AdicionarSolicitacao";
                let cliente = JSON.parse(localStorage.getItem("cliente")!);
                let servico = JSON.parse(localStorage.getItem("servico")!);
                let dadosForm = new FormData();
                dadosForm.append("cpf", cliente.cpf);
                dadosForm.append("desc", this.form.controls["descServico"].value!);
                dadosForm.append("codigoServico", servico.codigo);

                if (this.imgs.length > 0) {
                    for (let i = 0; i < this.imgs.length; i++) {
                        dadosForm.append("files", this.imgs[i].blob, this.imgs[i].blob.name);
                    }
                }

                try {
                    this.carregar = true;
                    let res = await firstValueFrom(this.http.post(link, dadosForm, { headers: headerNgrok }));

                    localStorage.setItem("solicitacao", JSON.stringify(res));
                    this.navCl.navigateForward("/escolher-trabalhador");
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
            else {
                let solicitacao = JSON.parse(localStorage.getItem("solicitacao")!);
                solicitacao.DsServico = this.form.controls['descServico'].value;

                let link = dominio + "/SolicitacaoServico/AtualizarSituacao";
                let dadosForm = new FormData();
                dadosForm.append("solicitacaoServico", JSON.stringify(solicitacao));

                if (this.imgs.length > 0) {
                    for (let i = 0; i < this.imgs.length; i++) {
                        dadosForm.append("files", this.imgs[i].blob, this.imgs[i].blob.name);
                    }
                }

                try {
                    this.carregar = true;
                    let res = await firstValueFrom(this.http.post(link, dadosForm));
                    this.carregar = false;

                    localStorage.setItem("solicitacao", JSON.stringify(solicitacao));
                    this.navCl.navigateForward("/escolher-trabalhador");
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
