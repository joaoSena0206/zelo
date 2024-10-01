import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { NavController } from '@ionic/angular';

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
        let link = "https://chow-master-properly.ngrok-free.app/Patrocinio/CarregarPatrocinados";

        this.carregar = true;

        let res = await firstValueFrom(this.http.get(link));

        this.patrocinados = res;
    }

    async carregarHistorico() {
        let cliente = JSON.parse(localStorage.getItem("cliente")!);
        let link = `https://chow-master-properly.ngrok-free.app/SolicitacaoServico/CarregarUltimosPedidos?c=${cliente.Cpf}&t=cliente`;

        this.carregar = true;

        let res = await firstValueFrom(this.http.get(link));

        this.historico = res;

        this.carregar = false;
    }

    async carregarCategorias() {
        let link = "https://chow-master-properly.ngrok-free.app/CategoriaServico/CarregarCategoria";

        this.carregar = true;

        let res = await firstValueFrom(this.http.get(link));
        this.categorias = res;

        if (this.categorias != null) {
            link = "https://chow-master-properly.ngrok-free.app/Servico/CarregarServicos";

            let res2 = await firstValueFrom(this.http.get(link));

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
                        if (this.categorias[i].Codigo == servicos[j].CodigoCategoria) {
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
