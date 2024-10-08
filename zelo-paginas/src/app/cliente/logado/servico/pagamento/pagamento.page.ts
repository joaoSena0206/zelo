import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { loadMercadoPago } from '@mercadopago/sdk-js'
import { firstValueFrom } from 'rxjs';
import { dominio, headerNgrok } from 'src/app/gerais';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-pagamento',
    templateUrl: './pagamento.page.html',
    styleUrls: ['./pagamento.page.scss'],
})
export class PagamentoPage implements OnInit {
    mercadoPagoVersion: any;
    tempo: any;
    copiaCola: any;
    qrCode: any;
    carregar: boolean = false;

    constructor(private navCl: NavController, private http: HttpClient, private sanitizer: DomSanitizer) { }

    async ngOnInit() {
        if (!localStorage.getItem("tempoPagamento")) {
            let tempo = {
                min: 0,
                seg: 10
            }

            this.tempo = tempo;
            localStorage.setItem("tempoPagamento", JSON.stringify(tempo));
        }
        else {
            this.tempo = JSON.parse(localStorage.getItem("tempoPagamento")!);
        }

        this.fazerPagamentoMp();
    }

    async fazerPagamentoMp() {
        let solicitacao = JSON.parse(localStorage.getItem("solicitacao")!);
        let trabalhador = JSON.parse(localStorage.getItem("trabalhadorEscolhido")!);
        let cliente = JSON.parse(localStorage.getItem("cliente")!);

        let dataExpiracao = new Date();
        dataExpiracao.setMinutes(dataExpiracao.getMinutes() + 15);

        let link = dominio + "/Cliente/GerarPagamento";
        let dadosForm = new FormData();
        dadosForm.append("valor", trabalhador.ValorVisita);
        dadosForm.append("email", cliente.Email);
        dadosForm.append("cpf", cliente.Cpf);
        dadosForm.append("c", solicitacao.CdSolicitacaoServico);
        dadosForm.append("expiracao", dataExpiracao.toISOString());

        this.carregar = true;
        let res: any = await firstValueFrom(this.http.post(link, dadosForm, { headers: headerNgrok }));
        this.carregar = false;

        if (res) {
            this.copiaCola = res.point_of_interaction.transaction_data.qr_code;
            this.qrCode = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + res.point_of_interaction.transaction_data.qr_code_base64);
        }

        console.log(res);

        /* this.temporizador(); */
    }

    temporizador() {
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
                if (solicitacao.Trabalhador != null) {
                    solicitacao.Trabalhador.Cpf = null;
                }

                localStorage.removeItem("tempoPagamento");
                this.navCl.navigateBack("/escolher-trabalhador");

                clearInterval(id);
            }
        }, 1000);
    }
}
