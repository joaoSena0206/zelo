import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ElementRef } from '@angular/core';

@Component({
    selector: 'app-trabalhos',
    templateUrl: './trabalhos.page.html',
    styleUrls: ['./trabalhos.page.scss'],
})
export class TrabalhosPage implements OnInit {
    cliente: any = JSON.parse(localStorage.getItem("cliente")!);
    carregar: boolean = false;
    categorias: any;

    @ViewChildren("ngContainer") ngContainer: QueryList<ElementRef>;

    constructor(private http: HttpClient) { }

    ngOnInit() {

    }

    ionViewDidEnter() {
        this.carregarCategorias();
    }

    ngAfterViewInit() {
        this.ngContainer.changes.subscribe(() => {
            const cards = document.querySelectorAll(".local_ultimos_trabalhos ion-card");

            for (let i = 0; i < cards.length; i++) {
                if ((cards[i] as HTMLIonCardElement).clientWidth != (cards[0] as HTMLIonCardElement).clientWidth) {
                    (cards[i] as HTMLIonCardElement).style.maxWidth = `${(cards[0] as HTMLIonCardElement).clientWidth}px`;
                }
            }

            window.addEventListener("resize", function () {
                const cards = document.querySelectorAll(".local_ultimos_trabalhos ion-card");

                for (let i = 0; i < cards.length; i++) {
                    if ((cards[i] as HTMLIonCardElement).clientWidth != (cards[0] as HTMLIonCardElement).clientWidth) {
                        (cards[i] as HTMLIonCardElement).style.maxWidth = `${(cards[0] as HTMLIonCardElement).clientWidth}px`;
                    }
                }
            });


        });
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

        this.carregar = false;
    }

    pesquisarServicos(input: any) {
        const cards = document.querySelectorAll(".local_ultimos_trabalhos ion-card");
        let valor = input.value;

        for (let i = 0; i < this.categorias.length; i++) {
            for (let j = 0; j < this.categorias[i].Servicos.length; j++) {
                if (this.categorias[i].Servicos[j].Nome.toLowerCase().includes(valor)) {
                    (cards[j] as HTMLIonCardElement).style.display = "block";
                }
                else {
                    (cards[j] as HTMLIonCardElement).style.display = "none";
                }
            }
        }
    }
}
