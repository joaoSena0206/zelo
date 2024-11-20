import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-centralajuda',
  templateUrl: './centralajuda.page.html',
  styleUrls: ['./centralajuda.page.scss'],
})
export class CentralajudaPage implements OnInit {

  constructor(private navCl: NavController) { }

  ngOnInit() {
  }

  voltarPag() {
    this.navCl.back();
  }

}
