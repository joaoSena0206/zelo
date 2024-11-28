import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-carteira-cliente',
  templateUrl: './carteira-cliente.page.html',
  styleUrls: ['./carteira-cliente.page.scss'],
})
export class CarteiraClientePage implements OnInit {

  constructor(private navCl: NavController) { }

  ngOnInit() {
  }

  voltarPag() {
    this.navCl.back();
  }

  marcogay(valor: any) {
    console.log(valor);
    localStorage.setItem("ValorDepositarCarteira", valor);
  }

}
