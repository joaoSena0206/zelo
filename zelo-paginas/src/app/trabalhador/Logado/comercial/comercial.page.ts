import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-comercial',
  templateUrl: './comercial.page.html',
  styleUrls: ['./comercial.page.scss'],
})
export class ComercialPage implements OnInit {

  constructor(private navCl: NavController) { }

  ngOnInit() {
  }

  voltarPag() {
    this.navCl.back();
  }

}
