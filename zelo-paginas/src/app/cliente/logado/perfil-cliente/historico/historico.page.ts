import { Component, OnInit } from '@angular/core';
import { dominio, headerNgrok } from 'src/app/gerais';
import { NavController } from '@ionic/angular';
import { first, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-historico',
    templateUrl: './historico.page.html',
    styleUrls: ['./historico.page.scss'],
})
export class HistoricoPage implements OnInit {

    constructor(private http: HttpClient, private navCl: NavController) { }

  ngOnInit() {
  }

  voltarPag() {
    this.navCl.back();
  }

  cliente: any = JSON.parse(localStorage.getItem("cliente")!);
  historico: any;
  Nome: any = this.cliente.Nome;
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
    let link = dominio + `/SolicitacaoServico/CarregarHistoricoCliente?cpf=${this.cliente.Cpf}&tipo=cliente`;

    try {

      this.carregar = true;
      let res: any = await firstValueFrom(this.http.get(link, { headers: headerNgrok }));

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

    for (let i = 0; i < this.historico.length; i++) {
      
      const dateString: string = this.historico[i].DtSolicitacaoServico;
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

      this.historico[i].DtSolicitacaoServico = this.listaDataServico[i];
      
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
                    if (a.DtSolicitacaoServico > b.DtSolicitacaoServico) {
                        return -1;
                    }
                    else if (a.DtSolicitacaoServico < b.DtSolicitacaoServico) {
                        return 1;
                    }

                    return 0;
                });
            }
            else if (btn.textContent == "Antigos") {
                this.historico.sort((a: any, b: any) => {
                    if (a.DtSolicitacaoServico < b.DtSolicitacaoServico) {
                        return -1;
                    }
                    else if (a.DtSolicitacaoServico > b.DtSolicitacaoServico) {
                        return 1;
                    }

                    return 0;
                });
            } else {
                this.historico.sort((a: any, b: any) => {
                    if (a.QtEstrelasAvaliacaoServico > b.QtEstrelasAvaliacaoServico) {
                        return -1;
                    }
                    else if (a.QtEstrelasAvaliacaoServico < b.QtEstrelasAvaliacaoServico) {
                        return 1;
                    }

                    return 0;
                });
            }
        }
    }
}

VerPerfil(Cpf: any, Nome: any){
  let clienteVerPerfil = {Cpf: Cpf, Nome: Nome}
  localStorage.setItem('perfil', JSON.stringify(clienteVerPerfil))
  this.navCl.navigateBack("/perfil-trabalhador")
}

  ngAfterViewInit() {
    this.carregarHistorico();
  }
}
