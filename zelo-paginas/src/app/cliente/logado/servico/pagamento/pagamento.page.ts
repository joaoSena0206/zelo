import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { loadMercadoPago } from '@mercadopago/sdk-js'
import { firstValueFrom } from 'rxjs';
import { dominio, headerNgrok } from 'src/app/gerais';
import { DomSanitizer } from '@angular/platform-browser';
import { Clipboard } from '@capacitor/clipboard';

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
    inputPix: any;

    constructor(private navCl: NavController, private http: HttpClient, private sanitizer: DomSanitizer) { }

    async ngOnInit() {
        if (!localStorage.getItem("tempoPagamento")) {
            let tempo = {
                min: 10,
                seg: 0
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
            localStorage.setItem("idPagamento", res.id);
        }

        this.temporizador();
    }

    async checarPagamento() {
        let id = localStorage.getItem("idPagamento");
        let link = dominio + "/Cliente/ChecarPagamento?id=" + id;
        let res: any = await firstValueFrom(this.http.get(link));

        if (res.status == "approved") {
            link = dominio + "/Cliente/EnviarConfirmacao";

            let trabalhador = JSON.parse(localStorage.getItem("trabalhadorEscolhido")!);
            let dadosForm = new FormData();
            dadosForm.append("token", trabalhador.TokenFCM);
            dadosForm.append("cliente", localStorage.getItem("cliente")!);
            dadosForm.append("solicitacao", localStorage.getItem("solicitacao")!);

            let res = await firstValueFrom(this.http.post(link, dadosForm, { responseType: "text" }));

            this.navCl.navigateRoot("trabalhador-caminho");
        }
    }

    async copiarPix() {
        await Clipboard.write({
            string: this.copiaCola
        });
    }

    temporizador() {
        if (this.tempo.min.toString().length == 1) {
            this.tempo.min = "0" + this.tempo.min.toString();
        }

        if (this.tempo.seg.toString().length == 1) {
            this.tempo.seg = "0" + this.tempo.seg.toString();
        }

        let id = setInterval(() => {
            this.checarPagamento();

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
                clearInterval(id);
                let solicitacao = JSON.parse(localStorage.getItem("solicitacao")!);
                if (solicitacao.Trabalhador != null) {
                    solicitacao.Trabalhador.Cpf = null;
                }

                localStorage.removeItem("tempoPagamento");
                this.navCl.navigateBack("/escolher-trabalhador");
            }
        }, 1000);
    }
}
