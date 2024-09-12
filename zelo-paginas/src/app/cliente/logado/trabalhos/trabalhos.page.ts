import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-trabalhos',
    templateUrl: './trabalhos.page.html',
    styleUrls: ['./trabalhos.page.scss'],
})
export class TrabalhosPage implements OnInit {
    constructor() { }

    ngOnInit() {

    }

    ionViewDidEnter() {
        const cards = document.querySelectorAll(".local_ultimos_trabalhos ion-card");

        for (let i = 0; i < cards.length; i++) {
            if ((cards[i] as HTMLIonCardElement).clientWidth != (cards[0] as HTMLIonCardElement).clientWidth) {
                (cards[i] as HTMLIonCardElement).style.maxWidth = `${(cards[0] as HTMLIonCardElement).clientWidth}px`;
            }
        }

        window.addEventListener("resize", function () {
            const cards = document.querySelectorAll(".local_ultimos_trabalhos ion-card");

            for (let i = 0; i < cards.length; i++) {
                if ((cards[i] as HTMLIonCardElement).clientWidth != (cards[0] as HTMLIonCardElement).clientWidth) {
                    (cards[i] as HTMLIonCardElement).style.maxWidth = `${(cards[0] as HTMLIonCardElement).clientWidth}px`;
                }
            }
        });
    }
}
