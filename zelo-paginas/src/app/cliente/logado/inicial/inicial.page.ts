import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { NavController } from '@ionic/angular';
import { dominio, headerNgrok } from 'src/app/gerais';

@Component({
    selector: 'app-inicial',
    templateUrl: './inicial.page.html',
    styleUrls: ['./inicial.page.scss'],
})
export class InicialPage implements OnInit {
    cliente: any = JSON.parse(localStorage.getItem("cliente")!);
    categorias: any;
    patrocinados: any;
    historico: any;
    carregar: boolean = false;
    mostrar: boolean = true;

    constructor(private http: HttpClient, private navCl: NavController) { }

    ngOnInit() {
        this.carregarCategorias();
        this.carregarPatrocinados();
        this.carregarHistorico();
    }

    async carregarPatrocinados() {
        let link = dominio + "/Patrocinio/CarregarPatrocinados";

        this.carregar = true;

        let res = await firstValueFrom(this.http.get(link, { headers: headerNgrok }));

        this.patrocinados = res;

        for (let i = 0; i < this.patrocinados.length; i++) {
            this.carregarImgTrabalhador(this.patrocinados[i].Trabalhador.Cpf, i);
        }
    }

    async carregarHistorico() {
        let cliente = JSON.parse(localStorage.getItem("cliente")!);
        let link = dominio + `/SolicitacaoServico/CarregarUltimosPedidos?c=${cliente.Cpf}&t=cliente`;

        this.carregar = true;

        let res = await firstValueFrom(this.http.get(link, { headers: headerNgrok }));

        this.historico = res;

        this.carregar = false;

        for (let i = 0; i < this.historico.length; i++) {
            this.carregarImgPerfil(this.historico[i].Trabalhador.Cpf, i);
        }
    }

    async carregarImgPerfil(cpf: any, i: any) {
        let link = dominio + `/Imgs/Perfil/Trabalhador/${cpf}.jpg`;
        let res: any = await firstValueFrom(this.http.get(link, { responseType: "blob", headers: headerNgrok }));
        let urlImg = URL.createObjectURL(res);

        this.historico[i].img = urlImg;
    }

    async carregarImgTrabalhador(cpf: any, i: any) {
        let link = dominio + `/Imgs/Trabalhadores/${cpf}.jpg`;
        let res = await firstValueFrom(this.http.get(link, { responseType: "blob", headers: headerNgrok }));
        let urlImg = URL.createObjectURL(res);

        this.patrocinados[i].img = urlImg;
    }

    async carregarCategorias() {
        let link = dominio + "/CategoriaServico/CarregarCategoria";

        this.carregar = true;

        let res = await firstValueFrom(this.http.get(link, { headers: headerNgrok }));
        this.categorias = res;

        if (this.categorias != null) {
            link = dominio + "/Servico/CarregarServicos";

            let res2 = await firstValueFrom(this.http.get(link, { headers: headerNgrok }));

            let servicos: any = res2;
            servicos.sort((a: any, b: any) => {
                if (a.Nome < b.Nome) {
                    return -1;
                }
                if (a.Nome > b.Nome) {
                    return 1;
                }
                return 0;
            });

            if (servicos != null) {
                for (let i = 0; i < this.categorias.length; i++) {
                    this.categorias[i].Servicos = [];

                    for (let j = 0; j < servicos.length; j++) {
                        if (this.categorias[i].Codigo == servicos[j].Categoria.Codigo) {
                            this.categorias[i].Servicos.push(servicos[j]);
                        }
                    }
                }
            }
        }
    }

    mostrarTrabalhos() {
        this.navCl.navigateForward("/trabalhos");
    }

    trackByPedido(index: number, pedido: any): any {
        return pedido.Trabalhador.Cpf;
    }

    pesquisarServicos(input: any) {
        const cards = document.querySelectorAll(".local_ultimos_trabalhos ion-card");

        let valor = input.value.toLowerCase();

        if (valor == "") {
            this.mostrar = true;
        }
        else {
            this.mostrar = false;
        }

        for (let i = 0; i < cards.length; i++) {
            if (valor == "") {
                if (i < 5) {
                    cards[i].classList.remove("escondido");
                }
                else {
                    cards[i].classList.add("escondido");
                }
            }
            else {

                if (cards[i].textContent?.toLowerCase().includes(valor)) {
                    cards[i].classList.remove("escondido");
                }
                else {
                    cards[i].classList.add("escondido");
                }
            }
        }
    }

    selecionarServico(servico: any) {
        localStorage.setItem("servico", JSON.stringify(servico));

        this.navCl.navigateForward("/escolher-trabalhador");
    }
}
