import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil-cliente',
  templateUrl: './perfil-cliente.page.html',
  styleUrls: ['./perfil-cliente.page.scss'],
})
export class PerfilClientePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    const estrelas = document.querySelectorAll(".estrelas ion-icon");

    if (estrelas.length == 3)
    {
        (estrelas[1] as HTMLIonIconElement).style.marginBottom = "-40px";
    }
    else if (estrelas.length == 4)
    {
        (estrelas[1] as HTMLIonIconElement).style.marginBottom = "-40px";
        (estrelas[2] as HTMLIonIconElement).style.marginBottom = "-40px";
    }
    else if (estrelas.length == 5)
    {
        (estrelas[0] as HTMLIonIconElement).style.marginTop = "-40px";
        (estrelas[4] as HTMLIonIconElement).style.marginTop = "-40px";
        (estrelas[2] as HTMLIonIconElement).style.marginBottom = "-40px";
    }
}

}
