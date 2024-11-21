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

    constructor(private http: HttpClient, private navCl: NavController) { }

    ngOnInit() {
        this.carregarEstrelas(5);
    }

    nomeIconeEstrela: any = ['', '', '', '', ''];
    EstrelaSelecionada: any;
    dominio = dominio;
    carregar: boolean = false;
    cliente: any = JSON.parse(localStorage.getItem("cliente")!);
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
        dadosForm.append("tipo", "cliente");
        dadosForm.append("comentario", comentario.value?.toString()!);
        dadosForm.append("estrelas", this.EstrelaSelecionada);
        dadosForm.append("cdServico", this.cdSolicitacao.CdSolicitacaoServico);

        try {
            this.carregar = true;
            let resposta = await firstValueFrom(this.http.post(link, dadosForm, { headers: headerNgrok }));
            this.navCl.navigateRoot("trabalhador/inicial");
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
        this.navCl.navigateBack("/trabalhador/inicial")
    }

}
