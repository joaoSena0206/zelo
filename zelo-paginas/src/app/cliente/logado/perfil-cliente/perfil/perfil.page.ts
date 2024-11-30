import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { dominio, headerNgrok } from 'src/app/gerais';
import { first, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
    selector: 'app-perfil',
    templateUrl: './perfil.page.html',
    styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
    cliente: any = JSON.parse(localStorage.getItem("cliente")!);
    fotoPerfil: any;

    constructor(private navCl: NavController, private http: HttpClient) { }

    ngOnInit() {
        this.carregarQtAvaliacao();
    }

    ngAfterViewChecked() {
        this.formatarEstrelas();
    }

    voltarPag() {
        this.navCl.back();
    }

    ionViewDidEnter() {
        this.fotoPerfil = dominio + '/Imgs/Perfil/Cliente/' + this.cliente.Cpf + '.jpg?time=' + new Date().getTime();
    }

    ngAfterViewInit() {
    }

    formatarEstrelas() {
        const estrelas = document.querySelectorAll(".estrela_perfil");

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
        localStorage.removeItem("cliente");
        localStorage.removeItem("saldoCarteira");

        this.navCl.navigateRoot("");
    }

    gerarArrayEstrelas(numEstrelas: any) {
        let array = [];

        for (let i = 0; i < numEstrelas; i++) {
            array.push(0);
        }

        return array;
    }

    dominio = dominio;
    historico: any;
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
    TotalChamado: any;

    async carregarQtAvaliacao() {
        let link = dominio + `/SolicitacaoServico/pegarEstrelasTrabalhador?cpf=${this.cliente.Cpf}&tipo=cliente`;

        let res;

        try {
            this.carregar = true;
            res = await firstValueFrom(this.http.get(link, { headers: headerNgrok }));
            this.lista = res;

            this.MediaEstrelas = Number(this.lista.MediaEstrelas).toFixed(1);
            this.TotalAvaliacao = this.lista.TotalAvaliacoes;
            this.TotalChamado = this.lista.TotalServicos;

            this.carregarEstrelas(this.MediaEstrelas.replace(',', '.'));
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

    nomeIconeEstrela: any = ['', '', '', '', ''];

    carregarEstrelas(MediaEstrela: any){
        for (let i = 1; i < 6; i++) {
            if(i <= MediaEstrela)
            {
                this.nomeIconeEstrela[i - 1] = 'star';
            }
            else{
                if(i - MediaEstrela < 1)
                {
                    this.nomeIconeEstrela[i - 1] = 'star-half-outline';
                }
                else{
                    this.nomeIconeEstrela[i - 1] = 'star-outline';
                }
            }
        }
    }
}
