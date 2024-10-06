import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-pagamento',
    templateUrl: './pagamento.page.html',
    styleUrls: ['./pagamento.page.scss'],
})
export class PagamentoPage implements OnInit {
    tempo: any;

    constructor(private navCl: NavController, private http: HttpClient) { }

    ngOnInit() {
        if (!localStorage.getItem("tempoPagamento")) {
            let tempo = {
                min: 15,
                seg: 0
            }

            this.tempo = tempo;
            localStorage.setItem("tempoPagamento", JSON.stringify(tempo));
        }
        else {
            this.tempo = JSON.parse(localStorage.getItem("tempoPagamento")!);
        }

        if (this.tempo.min.toString().length == 1) {
            this.tempo.min = "0" + this.tempo.min.toString();
        }

        if (this.tempo.seg.toString().length == 1) {
            this.tempo.seg = "0" + this.tempo.seg.toString();
        }

        let id = setInterval(() => {
            if (Number(this.tempo.seg) == 0) {
                this.tempo.seg = 60;
                this.tempo.min -= 1;
            }

            if (this.tempo.min.toString().length == 1) {
                this.tempo.min = "0" + this.tempo.min.toString();
            }

            this.tempo.seg -= 1;

            if (this.tempo.seg.toString().length == 1) {
                this.tempo.seg = "0" + this.tempo.seg.toString();
            }

            localStorage.setItem("tempoPagamento", JSON.stringify(this.tempo));

            if (Number(this.tempo.min) == 0 && Number(this.tempo.seg) == 0) {
                let solicitacao = JSON.parse(localStorage.getItem("solicitacao")!);
                solicitacao.Trabalhador.Cpf = null;

                localStorage.removeItem("tempoPagamento");
                this.navCl.navigateBack("/escolher-trabalhador");

                clearInterval(id);
            }
        }, 1000);
    }
}
