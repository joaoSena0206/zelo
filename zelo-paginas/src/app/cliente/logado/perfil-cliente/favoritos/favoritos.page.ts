import { Component, OnInit } from '@angular/core';
import { dominio, headerNgrok } from 'src/app/gerais';
import { NavController } from '@ionic/angular';
import { first, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {

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
    let link = dominio + `/SolicitacaoServico/CarregarHistoricoCliente?cpf=${this.cliente.Cpf}&tipo=favoritos`;

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
