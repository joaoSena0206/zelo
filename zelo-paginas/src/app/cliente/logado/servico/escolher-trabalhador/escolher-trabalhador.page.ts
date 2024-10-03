import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { dominio, headerNgrok } from 'src/app/gerais';
import { NavController } from '@ionic/angular';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';

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

    voltarPag() {
        localStorage.removeItem("servico");

        this.navCl.back();
    }

    async carregarTrabalhadores(codigo: number) {
        let link = dominio + "/Trabalhador/CarregarTrabalhadores?c=" + codigo;

        this.carregar = true;
        let resposta: any = await firstValueFrom(this.http.get(link, { headers: headerNgrok }));

        for (let i = 0; i < resposta.length; i++) {
            let latlng = L.latLng(resposta[i].Trabalhador.LatitudeAtual, resposta[i].Trabalhador.LongitudeAtual);
            let posicaoAtual = await this.pegarPosicaoAtual();
            let distancia = Math.round(latlng.distanceTo(posicaoAtual) / 1000);

            resposta[i].Trabalhador.Distancia = distancia;
            this.carregarImgPerfil(resposta[i].Trabalhador.Cpf, i);
        }

        this.trabalhadores = resposta;
        this.carregar = false;
    }

    async pegarPosicaoAtual() {
        let coordenadas = await Geolocation.getCurrentPosition();
        return L.latLng(coordenadas.coords.latitude, coordenadas.coords.longitude);
    }

    async carregarImgPerfil(cpf: any, i: any) {
        let link = dominio + `/Imgs/Perfil/Trabalhador/${cpf}.jpg`;
        let res: any = await firstValueFrom(this.http.get(link, { responseType: "blob", headers: headerNgrok }));
        let urlImg = URL.createObjectURL(res);

        this.trabalhadores[i].Trabalhador.img = urlImg;
    }
}
