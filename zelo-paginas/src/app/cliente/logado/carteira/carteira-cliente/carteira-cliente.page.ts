import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-carteira-cliente',
    templateUrl: './carteira-cliente.page.html',
    styleUrls: ['./carteira-cliente.page.scss'],
})
export class CarteiraClientePage implements OnInit {
    cliente: any = JSON.parse(localStorage.getItem("cliente")!);

    constructor(private navCl: NavController) { }

    ngOnInit() {
    }

    voltarPag() {
        this.navCl.navigateRoot("/inicial");
    }

    salvarValor(valor: any) {
        let modal = document.querySelector("#example-modal") as HTMLIonModalElement;
        if (valor != "custom-checked") {
            localStorage.setItem("ValorDepositarCarteira", valor);
            modal.dismiss();

            this.navCl.navigateRoot("/pagamento-carteira");
        }
    }
}
