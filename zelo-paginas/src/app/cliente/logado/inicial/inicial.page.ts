import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-inicial',
    templateUrl: './inicial.page.html',
    styleUrls: ['./inicial.page.scss'],
})
export class InicialPage implements OnInit {
    cliente: any = JSON.parse(localStorage.getItem("cliente")!);
    categorias: any;

    constructor(private http: HttpClient) { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        let link = "http://localhost:57879/CategoriaServico/CarregarCategoria";

        this.http.get(link).subscribe(res => {
            this.categorias = res;

            if (this.categorias != null) {
                link = "http://localhost:57879/Servico/CarregarServicos";

                this.http.get(link).subscribe(res2 => {
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
    }
}
