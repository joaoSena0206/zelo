import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

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

    constructor(private http: HttpClient) { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.carregarCategorias();
        this.carregarPatrocinados();
        this.carregarHistorico();
    }

    async carregarPatrocinados() {
        let link = "http://localhost:57879/Patrocinio/CarregarPatrocinados";

        this.carregar = true;

        let res = await firstValueFrom(this.http.get(link));

        this.patrocinados = res;
    }

    async carregarHistorico() {
        let cliente = JSON.parse(localStorage.getItem("cliente")!);
        let link = `http://localhost:57879/SolicitacaoServico/CarregarUltimosPedidos?c=${cliente.Cpf}&t=cliente`;

        this.carregar = true;

        let res = await firstValueFrom(this.http.get(link));

        this.historico = res;

        this.carregar = false;
    }

    async carregarCategorias() {
        let link = "http://localhost:57879/CategoriaServico/CarregarCategoria";

        this.carregar = true;

        let res = await firstValueFrom(this.http.get(link));
        this.categorias = res;

        if (this.categorias != null) {
            link = "http://localhost:57879/Servico/CarregarServicos";

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

    }
}
