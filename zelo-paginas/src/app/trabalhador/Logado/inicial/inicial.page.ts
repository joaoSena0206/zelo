import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonList } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { first, firstValueFrom } from 'rxjs';
import { BackgroundRunner } from '@capacitor/background-runner';
import { headerNgrok } from 'src/app/gerais';

@Component({
    selector: 'app-inicial',
    templateUrl: './inicial.page.html',
    styleUrls: ['./inicial.page.scss'],
})
export class InicialPage implements OnInit {
    trabalhador: any = JSON.parse(localStorage.getItem("trabalhador")!);
    historico: any;
    Nome: any = this.trabalhador.Nome.trim();
    ComentarioAnonimo: any;
    qtEstrelas: any;
    carregar: boolean = false;

    constructor(private http: HttpClient) {

    }

    ngOnInit() { }

    ngAfterViewInit() {
        this.carregarHistorico();
        this.carregarComentarioAnonimo();
    }

    async init() {
        try {
            const permissions = await BackgroundRunner.requestPermissions({
                apis: ['geolocation'],
            });
            console.log('permissions', permissions);
        } catch (err) {
            console.log(`ERROR: ${err}`);
        }
    }

    async pegarLoc() {
        const resultado = await BackgroundRunner.dispatchEvent({
            label: "io.ionic.starter.localizacao",
            event: "pegarLoc",
            details: {}
        });

        console.log(resultado);
    }

    qlComentario(Indice: number): boolean {

        this.qtEstrelas = [];

        for (let i = 0; i < this.ComentarioAnonimo[Indice]['QtEstrelasAvaliacaoServico']; i++) {
            this.qtEstrelas.push(1);
        }

        this.formatarEstrelas();

        return this.qtEstrelas;
    }

    formatarEstrelas() {
        const comentarios = document.querySelectorAll("ion-item");

        comentarios.forEach(comentario => {
            const estrelas = comentario.querySelectorAll(".estrela");

            if (estrelas.length == 3) {
                (estrelas[1] as HTMLIonIconElement).style.marginBottom = "-10px";
            }
            else if (estrelas.length == 4) {
                (estrelas[1] as HTMLIonIconElement).style.marginBottom = "-10px";
                (estrelas[2] as HTMLIonIconElement).style.marginBottom = "-10px";
            }
            else if (estrelas.length == 5) {

                (estrelas[0] as HTMLIonIconElement).style.marginTop = "-30px";
                (estrelas[4] as HTMLIonIconElement).style.marginTop = "-30px";

                (estrelas[0] as HTMLIonIconElement).style.position = "absolute";
                (estrelas[4] as HTMLIonIconElement).style.position = "absolute";

                (estrelas[0] as HTMLIonIconElement).style.marginLeft = "-45px";
                (estrelas[4] as HTMLIonIconElement).style.marginRight = "-45px";

                (estrelas[2] as HTMLIonIconElement).style.marginBottom = "-10px";
            }
        });
    }

    async carregarComentarioAnonimo() {
        let link = `https://chow-master-properly.ngrok-free.app/SolicitacaoServico/carregarcomentariosAnonimos?c=${this.trabalhador.Cpf}&t=trabalhador`;

        this.carregar = true;
        let res = await firstValueFrom(this.http.get(link, {headers: headerNgrok}));
        this.carregar = false;

        this.ComentarioAnonimo = res;
    }

    async carregarHistorico() {
        let trabalhador = JSON.parse(localStorage.getItem("trabalhador")!);
        let link = `https://chow-master-properly.ngrok-free.app/SolicitacaoServico/CarregarUltimosPedidos?c=${trabalhador.Cpf}&t=trabalhador`;

        this.carregar = true;
        let res = await firstValueFrom(this.http.get(link, {headers: headerNgrok}));

        this.historico = res;
    }

    msgTrabalho: any = 'Deseja trabalhar agora?';
    situacao: any = '';
    resultado: any = '';

    ionViewDidEnter() {
        const botaoSituacao = document.querySelector('#abrir_modal_servico');
        const img = document.querySelector('.img_btn_situacao');

        this.http.post('https://chow-master-properly.ngrok-free.app/Trabalhador/VerificarSituacao', JSON.stringify(this.trabalhador.cpf), { responseType: 'text', headers: headerNgrok }).subscribe(res => {

            if (res == "True") {
                this.situacao = 'Disponível';

                botaoSituacao?.classList.remove('btn_situacao_trabalhador');
                botaoSituacao?.classList.add('btn_situacao_trabalhador_disponivel');

                img?.setAttribute(
                    'src',
                    '../../../assets/icon/Trabalhador/Icone inicial/IconeAtivo.svg'
                );
            }
            else {
                botaoSituacao?.classList.add('btn_situacao_trabalhador');
                botaoSituacao?.classList.remove('btn_situacao_trabalhador_disponivel');

                img?.setAttribute('src', '../../../assets/icon/Trabalhador/Icone inicial/IconeOff.svg');

                this.situacao = 'Indisponível';
            }
        });

        this.formatarEstrelas();
    }

    gerarArrayEstrelas(numEstrelas: any) {
        let array = [];

        for (let i = 0; i < numEstrelas; i++) {
            array.push(0);
        }

        return array;
    }

    disponivel() {
        const botaoSituacao = document.querySelector('#abrir_modal_servico');
        const img = document.querySelector('.img_btn_situacao');

        if (this.situacao == 'Disponível') {

            botaoSituacao?.classList.add('btn_situacao_trabalhador');
            botaoSituacao?.classList.remove('btn_situacao_trabalhador_disponivel');

            img?.setAttribute('src', '../../../assets/icon/Trabalhador/Icone inicial/IconeOff.svg');

            this.situacao = 'Indisponível';
            this.msgTrabalho = 'Deseja trabalhar agora?';

            this.resultado = false;

        } else {
            botaoSituacao?.classList.remove('btn_situacao_trabalhador');
            botaoSituacao?.classList.add('btn_situacao_trabalhador_disponivel');

            img?.setAttribute(
                'src',
                '../../../assets/icon/Trabalhador/Icone inicial/IconeAtivo.svg'
            );

            this.situacao = 'Disponível';
            this.msgTrabalho = 'Deseja parar de trabalhar?';

            this.resultado = true;
        }

        let link = "https://chow-master-properly.ngrok-free.app/Trabalhador/AtualizarSituacao";

        let dadosForm = new FormData();
        dadosForm.append("Resultado", this.resultado!);

        this.http.post(link, dadosForm, { responseType: 'text', headers: headerNgrok }).subscribe(res => {
        })
    }

    async pegarLocalizacao() {
        const coords = await Geolocation.getCurrentPosition();

        console.log(coords);
    }
}
