import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { dominio, headerNgrok } from 'src/app/gerais';
import { first, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-perfil-trabalhador',
    templateUrl: './perfil-trabalhador.page.html',
    styleUrls: ['./perfil-trabalhador.page.scss'],
})

export class PerfilTrabalhadorPage implements OnInit {

    dominio = dominio;
    trabalhador: any = JSON.parse(localStorage.getItem("perfil")!);
    QtAvaliacao: any;
    lista: any;
    carregar: boolean = false;

    MediaEstrelas: any;
    TotalAvaliacao: any;
    TotalServico: any;

    listaDadosPerfil: any = [];

    DataFormatada: any;
    listaData: any = [];
    botaoAtivo: any;

    Porcentagem1: any;
    Porcentagem2: any;
    Porcentagem3: any;
    Porcentagem4: any;
    Porcentagem5: any;

    nPorcentagem1: any = 0;
    nPorcentagem2: any = 0;
    nPorcentagem3: any = 0;
    nPorcentagem4: any = 0;
    nPorcentagem5: any = 0;

    nomeIconeEstrela: any = ['', '', '', '', ''];

    avaliacoesFiltradas: any[] = [];

    mediaEstrela: any;

    constructor(private navCl: NavController, private http: HttpClient) { }

    ngOnInit() {
        this.carregarQtAvaliacao();
    }

    ionViewWillEnter() {
        this.carregarDadosPerfil();
        this.avaliacoesFiltradas = [...this.listaDadosPerfil];
    }

    voltarPag() {
        localStorage.removeItem('perfil');
        this.navCl.back();
    }

    ngAfterViewChecked(){
        const estrelas = document.querySelectorAll(".estrela");
        
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

            this.MediaEstrelas = Number(this.lista.MediaEstrelas).toFixed(1).replace('.', ',');
            this.mediaEstrela = Number(this.MediaEstrelas.replace(',', '.')).toFixed(0);

            this.TotalAvaliacao = Number(this.lista.TotalAvaliacoes);
            this.TotalServico = Number(this.lista.TotalServicos);

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

    async carregarDadosPerfil()
    {
        let link = dominio + `/Trabalhador/CarregarDadosPerfil`;
        let dadosForm = new FormData();
        dadosForm.append("cpfTrabalhador", this.trabalhador.Cpf);

        try {
            this.carregar = true;
            let resposta = await firstValueFrom(this.http.post(link, dadosForm, { headers: headerNgrok }));
            this.listaDadosPerfil = resposta

            for (let i = 0; i < this.listaDadosPerfil.length; i++) {
            
                const dateString: string = this.listaDadosPerfil[i].DtSolicitacaoServico;
                const timestamp: number = Date.parse(dateString);
                const date: Date = new Date(timestamp);
    
                let dia = date.getDate();
                let mes = date.getMonth() + 1;
                let ano = date.getFullYear();
    
                this.DataFormatada = null;
    
                if (mes < 10) {
                    this.DataFormatada = dia + "/" + "0" + mes + "/" + ano;
                }
                else {
                    this.DataFormatada = dia + "/" + mes + "/" + ano;
                }
    
                this.listaData.push(this.DataFormatada);
                
            }

            this.mudarFiltro('Todas');
            this.calcularPorcentagem(this.listaDadosPerfil);
            console.log(this.listaDadosPerfil[0].DsComentarioAvaliacaoServico);
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
    
    mudarFiltro(estrelas: string): void {
        this.botaoAtivo = estrelas;
        if (estrelas === "Todas") {
            this.avaliacoesFiltradas = [...this.listaDadosPerfil];
        } else {
            const numeroEstrelas = parseFloat(estrelas);

            this.avaliacoesFiltradas = this.listaDadosPerfil.filter(
                (avaliacao: any) => Math.floor(avaliacao.QtEstrelasAvaliacaoServico.toFixed(1)) === numeroEstrelas
            );
        }
    }

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

    calcularPorcentagem(listaDadosPerfil: any = [])
    {
        for (let i = 0; i < listaDadosPerfil.length; i++) {
            if(listaDadosPerfil[i].QtEstrelasAvaliacaoServico == 1)
            {
                this.nPorcentagem1 = this.nPorcentagem1 + 1;
            } 
            else if(listaDadosPerfil[i].QtEstrelasAvaliacaoServico == 2){
                this.nPorcentagem2 = this.nPorcentagem2 + 1;
            }
            else if(listaDadosPerfil[i].QtEstrelasAvaliacaoServico == 3){
                this.nPorcentagem3 = this.nPorcentagem3 + 1;
            }
            else if(listaDadosPerfil[i].QtEstrelasAvaliacaoServico == 4){
                this.nPorcentagem4 = this.nPorcentagem4 + 1;
            }
            else{
                this.nPorcentagem5 = this.nPorcentagem5 + 1;
            }
        }

        this.Porcentagem1 = (this.nPorcentagem1 / listaDadosPerfil.length) * 100;
        this.Porcentagem2 = (this.nPorcentagem2 / listaDadosPerfil.length) * 100;
        this.Porcentagem3 = (this.nPorcentagem3 / listaDadosPerfil.length) * 100;
        this.Porcentagem4 = (this.nPorcentagem4 / listaDadosPerfil.length) * 100;
        this.Porcentagem5 = (this.nPorcentagem5 / listaDadosPerfil.length) * 100;

        if(Number.isNaN(this.Porcentagem1))
        {
            this.Porcentagem1 = 0;
        }
        if(Number.isNaN(this.Porcentagem2))
        {
            this.Porcentagem2 = 0;
        }
        if(Number.isNaN(this.Porcentagem3))
        {
            this.Porcentagem3 = 0;
        }
        if(Number.isNaN(this.Porcentagem4))
        {
            this.Porcentagem4 = 0;
        }
        if(Number.isNaN(this.Porcentagem5))
        {
            this.Porcentagem5 = 0;
        }
    }
}
