import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { dominio, headerNgrok } from 'src/app/gerais';
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

    voltarPag() {
        localStorage.removeItem("servico");

        this.navCl.back();
    }

    async carregarTrabalhadores(codigo: number) {
        let link = dominio + "/Trabalhador/CarregarTrabalhadores?c=" + codigo;

        this.carregar = true;
        let resposta = await firstValueFrom(this.http.get(link, { headers: headerNgrok }));
        this.carregar = false;

        this.trabalhadores = resposta;

        for (let i = 0; i < this.trabalhadores.length; i++) {
            this.carregarImgPerfil(this.trabalhadores[i].Trabalhador.Cpf, i);
        }
    }

    async carregarImgPerfil(cpf: any, i: any) {
        let link = dominio + `/Imgs/Perfil/Trabalhador/${cpf}.jpg`;
        let res: any = await firstValueFrom(this.http.get(link, { responseType: "blob", headers: headerNgrok }));
        let urlImg = URL.createObjectURL(res);

        this.trabalhadores[i].Trabalhador.img = urlImg;
    }
}
