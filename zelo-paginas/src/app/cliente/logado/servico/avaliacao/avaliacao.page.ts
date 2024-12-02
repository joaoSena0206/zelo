import { Component, OnInit } from '@angular/core';
import { dominio, headerNgrok } from 'src/app/gerais';
import { first, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NavController, ToastController } from '@ionic/angular';

@Component({
    selector: 'app-avaliacao',
    templateUrl: './avaliacao.page.html',
    styleUrls: ['./avaliacao.page.scss'],
})
export class AvaliacaoPage implements OnInit {
    cliente: any = JSON.parse(localStorage.getItem("cliente")!);

    constructor(private http: HttpClient, private navCl: NavController) { }

    async ngOnInit() {
        this.carregarEstrelas(5);

        let link = dominio + "/TransacaoCarteira/AdicionarTransacao";
        let dadosForm = new FormData();
        dadosForm.append("cpf", this.cliente.Cpf);
        dadosForm.append("cliente", "true");
        dadosForm.append("valor", "-" + this.trabalhador.ValorVisita);

        let res: any = await firstValueFrom(this.http.post(link, dadosForm, { responseType: "text" }));

        if (res == "sucesso") {
            dadosForm.set("cpf", this.trabalhador.Cpf);
            dadosForm.set("cliente", "false");
            dadosForm.set("valor", (Number(this.trabalhador.ValorVisita) - Number(this.trabalhador.ValorVisita) * 0.1).toString())

            await firstValueFrom(this.http.post(link, dadosForm, { responseType: "text" }));
        }
    }

    nomeIconeEstrela: any = ['', '', '', '', ''];
    EstrelaSelecionada: any;
    dominio = dominio;
    carregar: boolean = false;
    trabalhador: any = JSON.parse(localStorage.getItem("trabalhadorEscolhido")!);
    cdSolicitacao: any = JSON.parse(localStorage.getItem("solicitacao")!);

    carregarEstrelas(MediaEstrela: any) {
        for (let i = 1; i < 6; i++) {
            if (i <= MediaEstrela) {
                this.nomeIconeEstrela[i - 1] = 'star';
            }
            else {
                if (i - MediaEstrela < 1) {
                    this.nomeIconeEstrela[i - 1] = 'star-half-outline';
                }
                else {
                    this.nomeIconeEstrela[i - 1] = 'star-outline';
                }
            }
        }
        this.EstrelaSelecionada = MediaEstrela;
    }

    async enviar() {
        let comentario = document.querySelector(".area_texto") as HTMLIonTextareaElement;

        let link = dominio + `/SolicitacaoServico/AtualizarAvaliacao`;

        let dadosForm = new FormData();
        dadosForm.append("tipo", "servico");
        dadosForm.append("comentario", comentario.value?.toString()!);
        dadosForm.append("estrelas", this.EstrelaSelecionada);
        dadosForm.append("cdServico", this.cdSolicitacao.CdSolicitacaoServico);

        try {
            this.carregar = true;
            let resposta = await firstValueFrom(this.http.post(link, dadosForm, { headers: headerNgrok }));

            localStorage.removeItem("servico");
            localStorage.removeItem("endereco");
            localStorage.removeItem("solicitacao");
            localStorage.removeItem("trabalhadorEscolhido");
            localStorage.removeItem("codigo");

            this.navCl.navigateRoot("inicial");
        }
        catch (erro: any) {
            const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
            alert.message = "Erro ao conectar-se ao servidor";
            alert.present();
        }
        finally {
            this.carregar = false;
        }
    }

    voltarPag() {
        this.navCl.navigateBack("/inicial")
    }

}
