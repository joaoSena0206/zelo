import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { dominio } from 'src/app/gerais';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-carteira-trabalhador',
    templateUrl: './carteira-trabalhador.page.html',
    styleUrls: ['./carteira-trabalhador.page.scss'],
})
export class CarteiraTrabalhadorPage implements OnInit {
    trabalhador: any = JSON.parse(localStorage.getItem("trabalhador")!);
    saldo: any = Number(localStorage.getItem("saldoCarteira"));
    carregar: boolean = false;
    transacoes: any;

    constructor(private navCl: NavController, private http: HttpClient) { }

    ngOnInit() {
        this.carregarTransacoes();
    }

    voltarPag() {
        this.navCl.navigateRoot("/trabalhador/inicial");
    }

    async carregarTransacoes() {
        try {
            let link = dominio + `/TransacaoCarteira/CarregarTransacoes?cpf=${this.trabalhador.Cpf}&tipo=trabalhador`;
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
