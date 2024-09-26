import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-inicial',
    templateUrl: './inicial.page.html',
    styleUrls: ['./inicial.page.scss'],
})
export class InicialPage implements OnInit {

    /* trabalhador: any = JSON.parse(localStorage.getItem("trabalhador")!);
    categorias: any;
    patrocinados: any;
    historico: any;

    constructor(private http: HttpClient) { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.carregarCategorias();
        this.carregarHistorico();
    }

    carregarHistorico() {
        let trabalhador = JSON.parse(localStorage.getItem("trabalhador")!);
        let link = `http://localhost:57879/SolicitacaoServico/CarregarUltimosPedidos?c=${trabalhador.Cpf}&t=cliente`;

        this.http.get(link).subscribe(res => {
            this.historico = res;
            console.log(this.historico);
        });
    }

    carregarCategorias() {

        let link = "http://localhost:57879/CategoriaServico/CarregarCategoria";

        this.http.get(link).subscribe(res => {
            this.categorias = res;

            if (this.categorias != null) {
                link = "http://localhost:57879/Servico/CarregarServicos";

                this.http.get(link).subscribe(res2 => {
                    
                    let servicos: any = res2;

                    if (servicos != null) {
                        for (let i = 0; i < this.categorias.length; i++) {
                            this.categorias[i].Servicos = [];

                            for (let j = 0; j < servicos.length; j++) {
                                if (j == 5) {
                                    break;
                                }

                                if (this.categorias[i].Codigo == servicos[j].CodigoCategoria) {
                                    this.categorias[i].Servicos.push(servicos[j]);
                                }
                            }
                        }
                    }
                });
            }
        });
    } */

    msgTrabalho: any = 'Deseja trabalhar agora?';

    constructor(private http: HttpClient) { }

    ngOnInit() { }

    cpf: any = 535305697
    situacao: any = '';
    resultado: any = '';
    

    ionViewDidEnter() {
        const botaoSituacao = document.querySelector('#abrir_modal_servico');
        const img = document.querySelector('.img_btn_situacao');

        this.http.post('http://localhost:57879/Trabalhador/VerificarSituacao', JSON.stringify(this.cpf), {responseType: 'text'}).subscribe(res => {

            if(res == "True")
            {
                this.situacao = 'Disponível';

                botaoSituacao?.classList.remove('btn_situacao_trabalhador');
                botaoSituacao?.classList.add('btn_situacao_trabalhador_disponivel');

                img?.setAttribute(
                    'src',
                    '../../../assets/icon/Trabalhador/Icone inicial/IconeAtivo.svg'
                );
            }
            else
            {
                botaoSituacao?.classList.add('btn_situacao_trabalhador');
                botaoSituacao?.classList.remove('btn_situacao_trabalhador_disponivel');

                img?.setAttribute('src', '../../../assets/icon/Trabalhador/Icone inicial/IconeOff.svg');

                this.situacao = 'Indisponível';
            }
        });
        
        this.http.get('http://localhost:57879/SolicitacaoServico/CarregarUltimosPedidos', {responseType: 'text'}).subscribe(res => {
            console.log(res)

            const lista = JSON.parse(res);
            console.log(lista)

            const areaUltimosPedidos = document.querySelector('.local_ultimos_trabalhos');

            for (let i = 0; i < lista.length; i++) {

                const divUltimosPedidos = document.createElement('ion-card') as HTMLIonCardElement;
                divUltimosPedidos.classList.add('oi');
                
                divUltimosPedidos.innerHTML +=  `<img class="img_pedido" src="../../../assets/icon/Trabalhador/imagens/image 119.png" alt="">
                                                <p class="nm_cliente_pedido">${lista[i]['Cliente']['Nome']}</p>
                                                <p class="ds_pedido">${lista[i]['DsServico']}</p>`;

                areaUltimosPedidos?.appendChild(divUltimosPedidos);
            }
            
        });

        const estrelas = document.querySelectorAll(".estrelas ion-icon");

        if (estrelas.length == 3)
        {
            (estrelas[1] as HTMLIonIconElement).style.marginBottom = "-20px";
        }
        else if (estrelas.length == 4)
        {
            (estrelas[1] as HTMLIonIconElement).style.marginBottom = "-20px";
            (estrelas[2] as HTMLIonIconElement).style.marginBottom = "-20px";
        }
        else if (estrelas.length == 5)
        {
            (estrelas[0] as HTMLIonIconElement).style.marginTop = "-20px";
            (estrelas[4] as HTMLIonIconElement).style.marginTop = "-20px";
            (estrelas[2] as HTMLIonIconElement).style.marginBottom = "-20px";
        }
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

        let link = "http://localhost:57879/Trabalhador/AtualizarSituacao";

        let dadosForm = new FormData();
        dadosForm.append("Resultado", this.resultado!);

        this.http.post(link, dadosForm, {responseType: 'text'}).subscribe(res => {
        })
        
    }
}
