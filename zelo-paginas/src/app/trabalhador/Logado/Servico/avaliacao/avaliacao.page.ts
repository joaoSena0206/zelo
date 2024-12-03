import { Component, OnInit } from '@angular/core';
import { dominio, headerNgrok } from 'src/app/gerais';
import { first, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
    selector: 'app-avaliacao',
    templateUrl: './avaliacao.page.html',
    styleUrls: ['./avaliacao.page.scss'],
})
export class AvaliacaoPage implements OnInit {

    constructor(private http: HttpClient, private navCl: NavController, private toastController: ToastController, private router: Router) { }

    ngOnInit() {
        localStorage.removeItem("codigoConfirmado");

        this.carregarEstrelas(0);
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

        if (comentario.value == "") {
            dadosForm.append("comentario", null!);
        }

        if (this.EstrelaSelecionada == 0) {
            let erro = document.querySelector(".erro") as HTMLIonAlertElement;
            erro.classList.remove("escondido");
            return;
        }
        else {
            let erro = document.querySelector(".erro") as HTMLIonAlertElement;
            erro.classList.add("escondido");
        }

        dadosForm.append("comentario", comentario.value?.toString()!);
        dadosForm.append("estrelas", this.EstrelaSelecionada);
        dadosForm.append("cdServico", this.cdSolicitacao.CdSolicitacaoServico);

        try {
            this.carregar = true;
            let resposta = await firstValueFrom(this.http.post(link, dadosForm, { headers: headerNgrok }));

            localStorage.removeItem("solicitacao");
            localStorage.removeItem("cliente");

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

    ionViewDidLeave() {
        const nextUrl = this.router.url;

        if (nextUrl === '/trabalhador/inicial') {
            this.showTemporaryToast();
        }
    }

    async showTemporaryToast() {
        const toast = await this.toastController.create({
            message: 'Pedido completo com sucesso!',
            duration: 2000,
            position: 'top',
            cssClass: 'custom-toast',
        });

        await toast.present();
    }

}
