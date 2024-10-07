import { Component, OnInit } from '@angular/core';
import { dominio, headerNgrok } from 'src/app/gerais';
import { NavController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
  /* trabalhador: any = JSON.parse(localStorage.getItem("trabalhador")!);
  Nome: any = this.trabalhador.Nome.trim(); */

  constructor(private http: HttpClient, private navCl: NavController) { }

  ngOnInit() {
    this.clienteServico = JSON.parse(localStorage.getItem('cliente')!);
    this.enderecoServico = JSON.parse(localStorage.getItem('endereco')!);
    this.solicitacaoServico = JSON.parse(localStorage.getItem('solicitacao')!);
    this.cdSolicitacao = this.solicitacaoServico.CdSolicitacaoServico;

    console.log(this.solicitacaoServico);

    this.carregarImgs();
  }

  async carregarImgs() {
    console.log(this.cdSolicitacao);

    let link = dominio + `/ImgSolicitacao/CarregarImgs?c=${1}`;

    this.carregar = true;

    let res = await firstValueFrom(this.http.get(link, { headers: headerNgrok }));

    this.imagens = res;

    console.log(this.imagens);

    for (let i = 0; i < this.imagens.length; i++) {
        this.carregarImgServico(this.imagens[i].Solicitacao.CdSolicitacaoServico, this.imagens[i].Codigo, this.imagens[i].TipoArquivo, i);
    }
  }

  async carregarImgServico(cdServico: any, cdimg: any, nmTipoImg: any, i: any) {

    console.log(this.imagens[i].Solicitacao.CdSolicitacaoServico);
    let link = dominio + `/Imgs/Solicitacao/${cdServico}/${cdimg}.${nmTipoImg}`;
    let res = await firstValueFrom(this.http.get(link, { responseType: "blob", headers: headerNgrok }));
    let urlImg = URL.createObjectURL(res);

    this.imagens[i].img = urlImg;
  }

  ngAfterViewInit(){
    
  }

  async aceitarServico(/* trabalhador: any */){
    /* let dadosForm = new FormData();
    dadosForm.append("token", trabalhador.TokenFCM);
    dadosForm.append("situacao", "true");

    let link = dominio + "/Trabalhador/EnviarServicoAceito";
    let resposta = await firstValueFrom(this.http.post(link, dadosForm, { headers: headerNgrok, responseType: "text" })); */
  }

  ignorarServico(){

  }

}
