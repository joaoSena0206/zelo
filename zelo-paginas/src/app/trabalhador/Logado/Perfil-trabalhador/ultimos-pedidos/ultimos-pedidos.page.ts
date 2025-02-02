import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonList, ModalController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { first, firstValueFrom } from 'rxjs';
import { BackgroundRunner } from '@capacitor/background-runner';
import { dominio, headerNgrok } from 'src/app/gerais';
import { NavController } from '@ionic/angular';
import { BackgroundGeolocationPlugin } from "@capacitor-community/background-geolocation";
import { registerPlugin } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { DOCUMENT } from '@angular/common';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';

@Component({
  selector: 'app-ultimos-pedidos',
  templateUrl: './ultimos-pedidos.page.html',
  styleUrls: ['./ultimos-pedidos.page.scss'],
})
export class UltimosPedidosPage implements OnInit {

  constructor(private http: HttpClient, private navCl: NavController) { }

  ngOnInit() {
  }

  voltarPag() {
    this.navCl.back();
  }

  trabalhador: any = JSON.parse(localStorage.getItem("trabalhador")!);
  historico: any;
  Nome: any = this.trabalhador.nome;
  ComentarioAnonimo: any;
  qtEstrelas: any;
  carregar: boolean = false;
  watcherId: any;
  result: any;
  clienteServico: any;
  solicitacaoServico: any;
  enderecoServico: any;
  modal: any;
  listaDataServico: any = [];
  dominio = dominio;

  async carregarHistorico() {
    let trabalhador = JSON.parse(localStorage.getItem("trabalhador")!);
    let link = dominio + `/SolicitacaoServico/CarregarHistoricoTrabalhador?cpf=${trabalhador.cpf}&tipo=trabalhador`;

    try {

      this.carregar = true;
      let res: any = await firstValueFrom(this.http.get(link, { headers: headerNgrok }));

      /* for (let i = 0; i < res.length; i++) {
        res[i].img = await this.carregarImgServico(res[i].cdSolicitacaoServico);
      } */

      this.historico = res;

    }
    catch (erro: any) {
      const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
      alert.message = "Erro ao conectar-se ao servidor";
      alert.present();
    }
    finally {
      this.carregar = false;
    }

    console.log(this.historico)

    for (let i = 0; i < this.historico.length; i++) {
      
      const dateString: string = this.historico[i].dtSolicitacaoServico;
      const timestamp: number = Date.parse(dateString);
      const date: Date = new Date(timestamp);

      let dia = date.getDate();
      let mes = date.getMonth() + 1;
      let ano = date.getFullYear();

      let DataFormatada = null;

      if(mes < 10)
      {
        DataFormatada = dia + "/" + "0" + mes + "/" + ano;
      }
      else
      {
        DataFormatada = dia + "/" + mes + "/" + ano;
      }

      this.listaDataServico.push(DataFormatada);

      this.historico[i].dtSolicitacaoServico = this.listaDataServico[i];
      
    }
    
  }

  mudarFiltro(btn: any) {
    const btns = document.querySelectorAll(".btn_filtro");

    for (let i = 0; i < btns.length; i++) {
        if (btn !== btns[i]) {
            if (btns[i].classList.contains("btn_filtro--ativado")) {
                btns[i].classList.remove("btn_filtro--ativado");
                btn.classList.add("btn_filtro--ativado");
            }

            if (btn.textContent == "Recentes") {
                this.historico.sort((a: any, b: any) => {
                    if (a.dtSolicitacaoServico > b.dtSolicitacaoServico) {
                        return -1;
                    }
                    else if (a.dtSolicitacaoServico < b.dtSolicitacaoServico) {
                        return 1;
                    }

                    return 0;
                });
            }
            else if (btn.textContent == "Antigos") {
                this.historico.sort((a: any, b: any) => {
                    if (a.dtSolicitacaoServico < b.dtSolicitacaoServico) {
                        return -1;
                    }
                    else if (a.dtSolicitacaoServico > b.dtSolicitacaoServico) {
                        return 1;
                    }

                    return 0;
                });
            }
            else {
                this.historico.sort((a: any, b: any) => {
                    if (a.qtEstrelasAvaliacaoCliente < b.qtEstrelasAvaliacaoCliente) {
                        return -1;
                    }
                    else if (a.qtEstrelasAvaliacaoCliente > b.qtEstrelasAvaliacaoCliente) {
                        return 1;
                    }

                    return 0;
                });
            }
        }
    }
}

  /* async carregarImgServico(cdSolicitacao: any) {
    try {
      this.carregar = true;

      let link = dominio + `/ImgSolicitacao/CarregarImgs?cdSolicitacao=${cdSolicitacao}&quantidade=1`;
      let res: any = await firstValueFrom(this.http.get(link, { headers: headerNgrok }));

      if (res.length > 0) {
        link = dominio + `/Imgs/Solicitacao/${cdSolicitacao}/1${res[0].tipoArquivo}`;
      }
      else {
        link = "../../../../assets/icon/geral/sem-foto.jpg";
      }

      res = await firstValueFrom(this.http.get(link, { headers: headerNgrok, responseType: "blob" }));

      const urlImg = URL.createObjectURL(res);

      return urlImg;
    }
    catch (erro: any) {
      const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
      alert.message = "Erro ao conectar-se ao servidor";
      alert.present();
    }
    finally {
      this.carregar = false;
    }

    return null;
  } */

  ngAfterViewInit() {
    this.carregarHistorico();
  }

}
