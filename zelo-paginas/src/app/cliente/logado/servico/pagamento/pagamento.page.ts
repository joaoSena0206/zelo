import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { first, firstValueFrom } from 'rxjs';
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
    id: any;

    constructor(private navCl: NavController, private http: HttpClient, private sanitizer: DomSanitizer) { }

    async ngOnInit() {
        if (!localStorage.getItem("tempoPagamento")) {
            let tempo = {
                min: 10,
                seg: 0
            }

            this.tempo = tempo;
            localStorage.setItem("tempoPagamento", JSON.stringify(tempo));

            this.fazerPagamentoMp();
        }
        else {
            this.tempo = JSON.parse(localStorage.getItem("tempoPagamento")!);

            let id = localStorage.getItem("idPagamento");
            let link = dominio + "/Cliente/ChecarPagamento?id=" + id;

            try {
                this.carregar = true;
                let res: any = await firstValueFrom(this.http.get(link));

                if (res.status != "cancelled") {
                    this.copiaCola = res.point_of_interaction.transaction_data.qr_code;
                    this.qrCode = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + res.point_of_interaction.transaction_data.qr_code_base64);

                    this.temporizador();
                }
                else {
                    localStorage.removeItem("idPagamento");
                    localStorage.removeItem("trabalhadorEscolhido");
                    localStorage.removeItem("tempoPagamento");

                    clearInterval(this.id);
                    this.enviarCancelamento();

                    this.navCl.navigateRoot("inicial");
                }
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

    async enviarCancelamento() {
        let trabalhador = JSON.parse(localStorage.getItem("trabalhadorEscolhido")!);
        let cliente = JSON.parse(localStorage.getItem("cliente")!);
        let link = dominio + "/EnviarPagamentoCancelado";
        let dadosForm = new FormData();
        dadosForm.append("pago", "false");
        dadosForm.append("token", trabalhador.TokenFCM);
        dadosForm.append("nmCliente", cliente.Nome);

        try {
            await firstValueFrom(this.http.post(link, dadosForm));
        }
        catch {
            const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
            alert.message = "Erro ao conectar-se ao servidor";
            alert.present();
        }
    }

    async fazerPagamentoMp() {
        let solicitacao = JSON.parse(localStorage.getItem("solicitacao")!);
        let trabalhador = JSON.parse(localStorage.getItem("trabalhadorEscolhido")!);
        let cliente = JSON.parse(localStorage.getItem("cliente")!);

        let dataExpiracao = new Date();
        dataExpiracao.setMinutes(dataExpiracao.getMinutes() + 15);

        let link = dominio + "/Cliente/GerarPagamento";
        let dadosForm = new FormData();
        dadosForm.append("valorVisita", trabalhador.ValorVisita);
        dadosForm.append("email", cliente.Email);
        dadosForm.append("cpf", cliente.Cpf);
        dadosForm.append("cdSolicitacao", solicitacao.CdSolicitacaoServico);
        dadosForm.append("expiracao", dataExpiracao.toISOString());

        try {
            this.carregar = true;
            let res: any = await firstValueFrom(this.http.post(link, dadosForm, { headers: headerNgrok }));

            this.copiaCola = res.point_of_interaction.transaction_data.qr_code;
            this.qrCode = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + res.point_of_interaction.transaction_data.qr_code_base64);
            localStorage.setItem("idPagamento", res.id);

            this.temporizador();
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

    async checarPagamento() {
        let id = localStorage.getItem("idPagamento");
        let link = dominio + "/Cliente/ChecarPagamento?id=" + id;

        try {
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
            else if (res.status == "cancelled") {
                localStorage.removeItem("idPagamento");
                localStorage.removeItem("trabalhadorEscolhido");
                localStorage.removeItem("tempoPagamento");

                this.enviarCancelamento();
                clearInterval(this.id);

                this.navCl.navigateRoot("inicial");
            }
        }
        catch {
            const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
            alert.message = "Erro ao conectar-se ao servidor";
            alert.present();
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

        this.id = setInterval(() => {
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
                clearInterval(this.id);

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
