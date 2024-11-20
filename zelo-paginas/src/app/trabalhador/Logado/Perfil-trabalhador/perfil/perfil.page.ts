import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { dominio, headerNgrok } from 'src/app/gerais';
import { first, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Component({
    selector: 'app-perfil',
    templateUrl: './perfil.page.html',
    styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

    dominio = dominio;
    trabalhador: any = JSON.parse(localStorage.getItem("trabalhador")!);
    historico: any;
    Nome: any = this.trabalhador.Nome;
    QtAvaliacao: any;
    lista: any;
    carregar: boolean = false;
    watcherId: any;
    result: any;
    clienteServico: any;
    solicitacaoServico: any;
    imgs: any;
    enderecoServico: any;
    modal: any;
    situacaoServico: any;

    MediaEstrelas: any;
    TotalAvaliacao: any;
    TotalServico: any;

    constructor(private navCl: NavController, private http: HttpClient) { }

    ngOnInit() {
        this.carregarQtAvaliacao();
        this.formatarEstrelas();
    }

    ngAfterViewChecked(){
        this.formatarEstrelas();
    }

    voltarPag() {
        this.navCl.back();
      }

    formatarEstrelas()
    {
        const estrelas = document.querySelectorAll(".estrela_perfil");

        console.log(estrelas)
        
        if (estrelas.length == 3) {
            (estrelas[1] as HTMLIonIconElement).style.marginBottom = "-40px";
        }
        else if (estrelas.length == 4) {
            (estrelas[1] as HTMLIonIconElement).style.marginBottom = "-40px";
            (estrelas[2] as HTMLIonIconElement).style.marginBottom = "-40px";
        }
        else if (estrelas.length == 5) {
            (estrelas[0] as HTMLIonIconElement).style.marginTop = "-40px";
            (estrelas[4] as HTMLIonIconElement).style.marginTop = "-40px";
            (estrelas[2] as HTMLIonIconElement).style.marginBottom = "-40px";
        }
    }

    sair() {
        localStorage.removeItem("logado");
        localStorage.removeItem("trabalhador");

        this.navCl.navigateRoot("");
    }

    gerarArrayEstrelas(numEstrelas: any) {
        let array = [];

        for (let i = 0; i < numEstrelas; i++) {
            array.push(0);
        }

        return array;
    }

    async carregarQtAvaliacao() {
        let link = dominio + `/SolicitacaoServico/pegarEstrelasTrabalhador?cpf=${this.trabalhador.Cpf}&tipo=trabalhador`;

        let res;

        try {
            this.carregar = true;
            res = await firstValueFrom(this.http.get(link, { headers: headerNgrok }));
            this.lista = res;

            this.MediaEstrelas = this.lista.MediaEstrelas;
            this.TotalAvaliacao = this.lista.TotalAvaliacoes;
            this.TotalServico = this.lista.TotalServicos;
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

    
}
