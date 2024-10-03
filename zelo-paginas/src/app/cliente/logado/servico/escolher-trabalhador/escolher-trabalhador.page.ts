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

    ngAfterViewInit() {
    }

    mudarFiltro(btn: any) {
        const btns = document.querySelectorAll(".btn_filtro");

        for (let i = 0; i < btns.length; i++) {
            if (btn !== btns[i]) {
                if (btns[i].classList.contains("btn_filtro--ativado")) {
                    btns[i].classList.remove("btn_filtro--ativado");
                    btn.classList.add("btn_filtro--ativado");
                }

                if (btn.textContent == "Próximos") {
                    this.trabalhadores.sort((a: any, b: any) => {
                        if (a.Trabalhador.Distancia < b.Trabalhador.Distancia) {
                            return -1;
                        }
                        else if (a.Trabalhador.Distancia > b.Trabalhador.Distancia) {
                            return 1;
                        }

                        return 0;
                    });
                }
                else if (btn.textContent == "Melhor avaliados") {
                    this.trabalhadores.sort((a: any, b: any) => {
                        if (a.Trabalhador.Avaliacao > b.Trabalhador.Avaliacao) {
                            return -1;
                        }
                        else if (a.Trabalhador.Avaliacao < b.Trabalhador.Avaliacao) {
                            return 1;
                        }

                        return 0;
                    });
                }
                else {
                    this.trabalhadores.sort((a: any, b: any) => {
                        if (a.Trabalhador.ValorVisita < b.Trabalhador.ValorVisita) {
                            return -1;
                        }
                        else if (a.Trabalhador.ValorVisita > b.Trabalhador.ValorVisita) {
                            return 1;
                        }

                        return 0;
                    });
                }
            }
        }
    }

    voltarPag() {
        localStorage.removeItem("servico");

        this.navCl.back();
    }

    async carregarTrabalhadores(codigo: number) {
        let link = dominio + "/Trabalhador/CarregarTrabalhadores?c=" + codigo;

        this.carregar = true;
        let resposta: any = await firstValueFrom(this.http.get(link, { headers: headerNgrok }));
        let posicaoAtual = await this.pegarPosicaoAtual();

        for (let i = 0; i < resposta.length; i++) {
            let latlng = L.latLng(resposta[i].Trabalhador.LatitudeAtual, resposta[i].Trabalhador.LongitudeAtual);
            let distancia = latlng.distanceTo(posicaoAtual) / 1000;

            link = dominio + `/Imgs/Perfil/Trabalhador/${resposta[i].Trabalhador.Cpf}.jpg`;
            let imgBlob: any = await firstValueFrom(this.http.get(link, { responseType: "blob", headers: headerNgrok }));
            let urlImg = URL.createObjectURL(imgBlob);

            resposta[i].Trabalhador.Distancia = distancia;
            resposta[i].Trabalhador.img = urlImg;
        }

        resposta.sort((a: any, b: any) => {
            if (a.Trabalhador.Distancia < b.Trabalhador.Distancia) {
                return -1;
            }
            else if (a.Trabalhador.Distancia > b.Trabalhador.Distancia) {
                return 1;
            }

            return 0;
        });

        this.trabalhadores = resposta;
        this.carregar = false;
    }

    async pegarPosicaoAtual() {
        let coordenadas = await Geolocation.getCurrentPosition();
        return L.latLng(coordenadas.coords.latitude, coordenadas.coords.longitude);
    }

    async carregarImgPerfil(cpf: any, i: any) {

    }
}
