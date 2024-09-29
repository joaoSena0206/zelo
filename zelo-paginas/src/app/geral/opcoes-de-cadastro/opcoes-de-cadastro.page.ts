import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';


@Component({
    selector: 'app-opcoes-de-cadastro',
    templateUrl: './opcoes-de-cadastro.page.html',
    styleUrls: ['./opcoes-de-cadastro.page.scss'],
})
export class OpcoesDeCadastroPage implements OnInit {

    constructor(private router: Router, private navCtrl: NavController) { }

    ngOnInit() {
    }

    proxPag(opcao: string) {
        this.navCtrl.navigateForward(`/${localStorage.getItem("opcao")}-${opcao}`);
    }

    pagAnterior() {
        this.navCtrl.navigateRoot("/home", {
            animated: true,
            animationDirection: "back"
        });
    }
}
