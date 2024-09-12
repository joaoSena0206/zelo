import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-perfil',
    templateUrl: './perfil.page.html',
    styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

    constructor() { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        const estrelas = document.querySelectorAll(".estrela");
        
        if (estrelas.length == 3) {
            console.log("a");

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
}
