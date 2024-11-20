import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.page.html',
    styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
    cliente: any;
    trabalhador: any;

    constructor() { }

    ngOnInit() {
        if (localStorage.getItem("trabalhador")) {
            this.trabalhador = JSON.parse(localStorage.getItem("trabalhador")!);
            this.cliente = JSON.parse(localStorage.getItem("cliente")!);
        }
    }
}
