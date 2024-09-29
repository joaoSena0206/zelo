import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-escolher-trabalhador',
    templateUrl: './escolher-trabalhador.page.html',
    styleUrls: ['./escolher-trabalhador.page.scss'],
})
export class EscolherTrabalhadorPage implements OnInit {
    carregar: boolean = false;
    trabalhadores: any;

    constructor(private http: HttpClient) { }

    ngOnInit() {
        let servico = JSON.parse(localStorage.getItem("servico")!);

        this.carregarTrabalhadores(servico.Codigo);
    }

    ionViewDidEnter() {

    }

    async carregarTrabalhadores(codigo: number) {
        let link = "http://localhost:57879/Trabalhador/CarregarTrabalhadores?c=" + codigo;

        this.carregar = true;
        let resposta = await firstValueFrom(this.http.get(link));
        this.carregar = false;

        this.trabalhadores = resposta;
    }
}
