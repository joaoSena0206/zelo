import { Component, OnInit } from '@angular/core';
import { first, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
        descServico: new FormControl("", Validators.required)
    });

    erro: any = {
        descServico: "Descrição do serviço obrigatório"
    };

    constructor(private http: HttpClient, private route: ActivatedRoute, private navCl: NavController) { }

    ngOnInit() {
        this.carregarServico();
        this.carregarEndereco();
    }

    ngAfterViewInit() {

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

    carregarServico() {
        const servico = JSON.parse(localStorage.getItem("servico")!);
        this.servico = servico;
    }

    async carregarEndereco() {
        let cliente = JSON.parse(localStorage.getItem("cliente")!);
        let link = "http://localhost:57879/Endereco/CarregarEndereco?cpf=" + cliente.Cpf;

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
    }

    voltarPag() {
        localStorage.removeItem("servico");

        this.navCl.back();
    }

}
