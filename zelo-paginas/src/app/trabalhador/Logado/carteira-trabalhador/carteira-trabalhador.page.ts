import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-carteira-trabalhador',
    templateUrl: './carteira-trabalhador.page.html',
    styleUrls: ['./carteira-trabalhador.page.scss'],
})
export class CarteiraTrabalhadorPage implements OnInit {

    constructor(private navCl: NavController) { }

    ngOnInit() {
    }

    voltarPag() {
        this.navCl.navigateRoot("/inicial");
    }

}
