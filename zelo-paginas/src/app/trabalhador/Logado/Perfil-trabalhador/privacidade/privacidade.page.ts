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
    const indicePonto = this.trabalhador.DataNascimento.indexOf("T");
    this.novoTexto = this.trabalhador.DataNascimento.substring(0, indicePonto);
  }

}
