import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-ultimos-pedidos',
  templateUrl: './ultimos-pedidos.page.html',
  styleUrls: ['./ultimos-pedidos.page.scss'],
})
export class UltimosPedidosPage implements OnInit {

  constructor(private navCl: NavController) { }

  ngOnInit() {
  }

  voltarPag() {
      this.navCl.back();
  }

}
