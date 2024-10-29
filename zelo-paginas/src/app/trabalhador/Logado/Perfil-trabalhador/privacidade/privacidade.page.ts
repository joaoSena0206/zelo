import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-privacidade',
  templateUrl: './privacidade.page.html',
  styleUrls: ['./privacidade.page.scss'],
})
export class PrivacidadePage implements OnInit {

  trabalhador: any = JSON.parse(localStorage.getItem("trabalhador")!);
  novoTexto: any;

  constructor() { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.pegarDados();
  }

  pegarDados() {
    const dateString: string = this.trabalhador.dataNascimento;
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

      this.novoTexto = DataFormatada;
  }

  editar(btn: any){
    console.log(btn);
  }

}
