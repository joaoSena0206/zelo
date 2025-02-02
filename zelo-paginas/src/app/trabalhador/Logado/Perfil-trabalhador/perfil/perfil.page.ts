import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-perfil',
    templateUrl: './perfil.page.html',
    styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

    constructor(private navCl: NavController) { }

    ngOnInit() {
    }

    ionViewDidEnter() {
        const estrelas = document.querySelectorAll(".estrelas ion-icon");

        if (estrelas.length == 3) {
            (estrelas[1] as HTMLIonIconElement).style.marginBottom = "-40px";
        }
        else if (estrelas.length == 4) {
            (estrelas[1] as HTMLIonIconElement).style.marginBottom = "-40px";
            (estrelas[2] as HTMLIonIconElement).style.marginBottom = "-40px";
        }
        else if (estrelas.length == 5) {
            (estrelas[0] as HTMLIonIconElement).style.marginTop = "-40px";
            (estrelas[4] as HTMLIonIconElement).style.marginTop = "-40px";
            (estrelas[2] as HTMLIonIconElement).style.marginBottom = "-40px";
        }
    }

    sair() {
        localStorage.removeItem("logado");
        localStorage.removeItem("trabalhador");

        this.navCl.navigateRoot("");
    }
}
