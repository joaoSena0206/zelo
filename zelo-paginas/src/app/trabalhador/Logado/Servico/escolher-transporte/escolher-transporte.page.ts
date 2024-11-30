import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-escolher-transporte',
  templateUrl: './escolher-transporte.page.html',
  styleUrls: ['./escolher-transporte.page.scss'],
})
export class EscolherTransportePage implements OnInit {

  constructor(private navCl: NavController) { }

  tipoTransporte: any = "";

  ngOnInit() {
  }

  ProximaPagina() {
    localStorage.setItem('TransporteEscolhido', this.tipoTransporte);
    this.navCl.navigateRoot("/trabalhador/trabalhador-caminho");
  }

  PegarTransporte(botao: any){
    this.tipoTransporte = botao;
  }
}
