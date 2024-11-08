import { Component, ElementRef, LOCALE_ID, OnInit, QueryList, ViewChildren } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { dominio, headerNgrok } from 'src/app/gerais';
import { NavController } from '@ionic/angular';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
import {
    ActionPerformed,
    PushNotificationSchema,
    PushNotifications,
    Token,
} from '@capacitor/push-notifications';

@Component({
    selector: 'app-escolher-trabalhador',
    templateUrl: './escolher-trabalhador.page.html',
    styleUrls: ['./escolher-trabalhador.page.scss'],
})
export class EscolherTrabalhadorPage implements OnInit {
    carregar: boolean = false;
    trabalhadores: any;
    tokenCliente: any;
    dominio = dominio;

    constructor(private http: HttpClient, private navCl: NavController) { }

    ngOnInit() {
        let servico = JSON.parse(localStorage.getItem("servico")!);
        this.carregarTrabalhadores(servico.Codigo);
    }

    ngAfterViewInit() {
    }

    async pegarSolicitacao() {

    }

    async contratarTrabalhador(trabalhador: any) {
        let dadosForm = new FormData();
        let imgs = JSON.parse(localStorage.getItem("imgs")!);

        for (let i = 0; i < imgs.length; i++) {
            let blob = this.base64ParaBlob(imgs[i].base64);
            let file = new File([blob], i.toString(), { type: "image/jpeg" });

            dadosForm.append("files", file);
        }

        dadosForm.append("token", trabalhador.TokenFCM);
        dadosForm.append("cliente", localStorage.getItem("cliente")!);
        dadosForm.append("solicitacao", localStorage.getItem("solicitacao")!);
        dadosForm.append("imgs", localStorage.getItem("imgs")!);
        dadosForm.append("endereco", localStorage.getItem("endereco")!);

        let link = dominio + "/Cliente/EnviarSolicitacao";

        try {
            let resposta = await firstValueFrom(this.http.post(link, dadosForm, { headers: headerNgrok, responseType: "text" }));

            const modal = document.querySelector("#modal_" + trabalhador.Cpf) as HTMLIonModalElement;
            modal.dismiss();
            const data = await modal.onDidDismiss();

            if (data) {
                localStorage.setItem("trabalhadorEscolhido", JSON.stringify(trabalhador));

                this.navCl.navigateRoot("/confirmacao-trabalhador");
            }

        }
        catch {
            const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
            alert.message = "Erro ao conectar-se ao servidor";
            alert.present();
        }
    }

    base64ParaBlob(dataURI: any) {
        let byteString = atob(dataURI.split(",")[1]);
        let ab = new ArrayBuffer(byteString.length);
        let ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ab], { type: 'image/jpeg' });
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
        this.navCl.back();
    }

    async carregarTrabalhadores(codigo: number) {
        let link = dominio + "/Trabalhador/CarregarTrabalhadores?codigo=" + codigo;

        try {
            this.carregar = true;
            let resposta: any = await firstValueFrom(this.http.get(link, { headers: headerNgrok }));
            let posicaoAtual = await this.pegarPosicaoAtual();

            for (let i = 0; i < resposta.length; i++) {
                let latlng = L.latLng(resposta[i].Trabalhador.LatitudeAtual, resposta[i].Trabalhador.LongitudeAtual);
                let distancia = latlng.distanceTo(posicaoAtual!) / 1000;

                resposta[i].Trabalhador.Distancia = distancia;
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
        }
        catch {
            const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
            alert.message = "Erro ao conectar-se ao servidor";
            alert.present();
        }
        finally {
            this.carregar = false;
        }
    }

    dismissModal(cpf: any) {
        const modal = document.querySelector("#modal_" + cpf) as HTMLIonModalElement;
        modal.dismiss();
    }

    async pegarPosicaoAtual() {
        const permissoes = await Geolocation.checkPermissions();

        let coordenadas: any;

        if (permissoes.location === "denied") {
            const requestPermissao = await Geolocation.requestPermissions();

            if (requestPermissao.location === "granted" || requestPermissao.location === "prompt") {
                const options: PositionOptions = {
                    enableHighAccuracy: true
                }

                coordenadas = await Geolocation.getCurrentPosition(options);
                console.log(coordenadas);

                return L.latLng(coordenadas.coords.latitude, coordenadas.coords.longitude);
            }
        }
        else if (permissoes.location === "granted" || permissoes.location === "prompt") {
            coordenadas = await Geolocation.getCurrentPosition();

            return L.latLng(coordenadas.coords.latitude, coordenadas.coords.longitude);
        }

        console.error("Necessário permissão");

        return;
    }
}
