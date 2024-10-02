import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { headerNgrok } from 'src/app/gerais';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-escolher-trabalhador',
    templateUrl: './escolher-trabalhador.page.html',
    styleUrls: ['./escolher-trabalhador.page.scss'],
})
export class EscolherTrabalhadorPage implements OnInit {
    carregar: boolean = false;
    trabalhadores: any;

    constructor(private http: HttpClient, private navCl: NavController) { }

    ngOnInit() {
        let servico = JSON.parse(localStorage.getItem("servico")!);

        this.carregarTrabalhadores(servico.Codigo);
    }

    ionViewDidEnter() {

    }

    voltarPag()
    {
        this.navCl.back();
    }

    async carregarTrabalhadores(codigo: number) {
        let link = "https://chow-master-properly.ngrok-free.app/Trabalhador/CarregarTrabalhadores?c=" + codigo;

        this.carregar = true;
        let resposta = await firstValueFrom(this.http.get(link, {headers: headerNgrok}));
        this.carregar = false;

        this.trabalhadores = resposta;
    }
}
