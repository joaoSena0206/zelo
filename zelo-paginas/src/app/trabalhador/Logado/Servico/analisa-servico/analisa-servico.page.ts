import { Component, OnInit } from '@angular/core';
import { dominio, headerNgrok } from 'src/app/gerais';
import { NavController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { cpf } from 'cpf-cnpj-validator';

@Component({
  selector: 'app-analisa-servico',
  templateUrl: './analisa-servico.page.html',
  styleUrls: ['./analisa-servico.page.scss'],
})
export class AnalisaServicoPage implements OnInit {
  clienteServico: any;
  enderecoServico: any;
  solicitacaoServico: any;
  imagens: any;
  carregar: boolean = false;
  cdSolicitacao: any;
  trabalhador: any = JSON.parse(localStorage.getItem("trabalhador")!);
  tokenCliente: any;
  cliente: any = JSON.parse(localStorage.getItem("cliente")!);
  dominio = dominio;

  constructor(private http: HttpClient, private navCl: NavController) { }

  ngOnInit() {
    this.clienteServico = JSON.parse(localStorage.getItem('cliente')!);
    this.enderecoServico = JSON.parse(localStorage.getItem('endereco')!);
    this.solicitacaoServico = JSON.parse(localStorage.getItem('solicitacao')!);
    this.cdSolicitacao = this.solicitacaoServico.CdSolicitacaoServico;
    this.carregarServicos();
    this.pegarTokenCliente();
    this.carregarImgPerfilCliente();
  }

  async pegarTokenCliente() {
    let dadosForm = new FormData();
    dadosForm.append("cpf", this.cliente.Cpf);
    let link = dominio + "/Cliente/PegarTokenFCM";

    try{
      this.tokenCliente = await firstValueFrom(this.http.post(link, dadosForm, { headers: headerNgrok, responseType: "text" }));
    }
    catch (erro: any) {
      const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
      alert.message = "Erro ao conectar-se ao servidor";
      alert.present();
    }

  }

  async carregarServicos() {
    let link = dominio + `/ImgSolicitacao/CarregarImgs?cdSolicitacao=${this.cdSolicitacao}`;

    try{
      this.carregar = true;
      let res = await firstValueFrom(this.http.get(link, { headers: headerNgrok }));
      this.imagens = res;

      for (let i = 0; i < this.imagens.length; i++) {
        this.carregarImgServico(this.imagens[i].Solicitacao.CdSolicitacaoServico, this.imagens[i].Codigo, this.imagens[i].TipoArquivo, i);
      }
    }
    catch (erro: any) {
      const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
      alert.message = "Erro ao conectar-se ao servidor";
      alert.present();
    }
    
  }

  async carregarImgServico(cdServico: any, cdimg: any, nmTipoImg: any, i: any) {
    let link = dominio + `/Imgs/Solicitacao/${cdServico}/${cdimg}${nmTipoImg}`;

    try{
      let res = await firstValueFrom(this.http.get(link, { responseType: "blob", headers: headerNgrok }));
      let urlImg = URL.createObjectURL(res);
      this.imagens[i].img = urlImg;
    }
    catch (erro: any) {
      const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
      alert.message = "Erro ao conectar-se ao servidor";
      alert.present();
    }
  }

  ngAfterViewInit() { }

  async aceitarServico() {
    let dadosForm = new FormData();
    dadosForm.append("token", this.tokenCliente);
    dadosForm.append("trabalhador", localStorage.getItem("trabalhador")!);
    dadosForm.append("situacaoServico", "true");
    let link = dominio + "/Trabalhador/EnviarServicoAceito";

    try{
      let resposta = await firstValueFrom(this.http.post(link, dadosForm, { headers: headerNgrok, responseType: "text" }));
      this.navCl.navigateRoot("/confirmacao-cliente");
    }
    catch (erro: any) {
      const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
      alert.message = "Erro ao conectar-se ao servidor";
      alert.present();
    }
  }

  async ignorarServico() {
    let dadosForm = new FormData();
    dadosForm.append("token", this.tokenCliente);
    dadosForm.append("trabalhador", localStorage.getItem("trabalhador")!);
    dadosForm.append("situacaoServico", "false");
    let link = dominio + "/Trabalhador/EnviarServicoAceito";

    try{
      let resposta = await firstValueFrom(this.http.post(link, dadosForm, { headers: headerNgrok, responseType: "text" }));
      this.navCl.navigateRoot("/trabalhador/inicial");
    }
    catch (erro: any) {
      const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
      alert.message = "Erro ao conectar-se ao servidor";
      alert.present();
    }
  }

  urlImg: any;

  async carregarImgPerfilCliente() {
    let link = dominio + `/Imgs/Perfil/Cliente/${this.cliente.Cpf}.jpg`;

    try{
      let res = await firstValueFrom(this.http.get(link, { responseType: "blob", headers: headerNgrok }));
      this.urlImg = URL.createObjectURL(res);
    }
    catch (erro: any) {
      const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
      alert.message = "Erro ao conectar-se ao servidor";
      alert.present();
    }
  }

}
