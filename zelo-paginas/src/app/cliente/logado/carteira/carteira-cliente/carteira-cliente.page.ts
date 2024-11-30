import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { dominio } from 'src/app/gerais';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-carteira-cliente',
    templateUrl: './carteira-cliente.page.html',
    styleUrls: ['./carteira-cliente.page.scss'],
})
export class CarteiraClientePage implements OnInit {
    cliente: any = JSON.parse(localStorage.getItem("cliente")!);
    saldo: any = Number(localStorage.getItem("saldoCarteira"));
    carregar: boolean = false;
    transacoes: any;

    constructor(private navCl: NavController, private http: HttpClient) { }

    ngOnInit() {
        this.carregarTransacoes();
    }

    voltarPag() {
        this.navCl.navigateRoot("/inicial");
    }

    salvarValor(valor: any) {
        if (valor != "custom-checked") {
            localStorage.setItem("ValorDepositarCarteira", valor);

            this.navCl.navigateRoot("/pagamento-carteira");
        }
    }

    async carregarTransacoes() {
        try {
            let link = dominio + `/TransacaoCarteira/CarregarTransacoes?cpf=${this.cliente.Cpf}&tipo=cliente`;
            this.carregar = true;
            let res: any = await firstValueFrom(this.http.get(link));

            this.transacoes = res;
        }
        catch {
            const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
            alert.message = "Erro ao conectar-se ao servidor";
            alert.present();
        }
        finally {
            this.carregar = false;
        }
    }
}
