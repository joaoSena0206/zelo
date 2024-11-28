import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { first, firstValueFrom } from 'rxjs';
import { dominio, headerNgrok } from 'src/app/gerais';
import { DomSanitizer } from '@angular/platform-browser';
import { Clipboard } from '@capacitor/clipboard';
import { ActionPerformed, PushNotificationSchema, PushNotifications, Token } from '@capacitor/push-notifications';
import { loadZone } from 'zone.js/lib/zone';

@Component({
    selector: 'app-pagamento-carteira',
    templateUrl: './pagamento-carteira.page.html',
    styleUrls: ['./pagamento-carteira.page.scss'],
})
export class PagamentoCarteiraPage implements OnInit {
    mercadoPagoVersion: any;
    tempo: any;
    copiaCola: any;
    qrCode: any;
    carregar: boolean = false;
    inputPix: any;
    id: any;
    result: any;
    situacao: any;
    cliente: any = JSON.parse(localStorage.getItem("cliente")!);

    constructor(private navCl: NavController, private http: HttpClient, private sanitizer: DomSanitizer) { }

    async ngOnInit() {
        PushNotifications.removeAllListeners();

        if (!localStorage.getItem("tempoPagamento")) {
            let tempo = {
                min: 10,
                seg: 0
            }

            this.tempo = tempo;
            localStorage.setItem("tempoPagamento", JSON.stringify(tempo));

            this.temporizador();
            let tempoAtual = new Date();
            localStorage.setItem("tempoAtual", tempoAtual.getTime().toString());

            this.fazerPagamentoMp();
        }
        else {
            let tempoDepois = new Date();
            let milisegundos = tempoDepois.getTime() - Number(localStorage.getItem("tempoAtual"));
            let diferencaSegundos = Math.floor(milisegundos / 1000);
            let minutosPassados = Math.floor(diferencaSegundos / 60);
            let segundosPassados = diferencaSegundos % 60

            let minutosRestantes = 0 - minutosPassados;
            let segundosRestantes = 59 - segundosPassados;

            if ((minutosRestantes == 0 && segundosRestantes == 0) || (minutosRestantes < 0)) {
                clearInterval(this.id);

                localStorage.removeItem("tempoPagamento");
                localStorage.removeItem("tempoAtual");
                localStorage.removeItem("trabalhadorEscolhido");
                localStorage.removeItem("idPagamento");
                localStorage.removeItem("ValorDepositarCarteira");

                this.navCl.navigateRoot("/carteira-cliente");
            }
            else {
                if (segundosRestantes < 0) {
                    segundosRestantes = 59;
                    minutosRestantes -= 1;
                }

                this.tempo = {
                    min: minutosRestantes,
                    seg: segundosRestantes
                };

                let id = localStorage.getItem("idPagamento");
                let link = dominio + "/Cliente/ChecarPagamento?id=" + id;

                try {
                    this.temporizador();

                    this.carregar = true;
                    let res: any = await firstValueFrom(this.http.get(link));

                    if (res.status != "cancelled") {
                        this.copiaCola = res.point_of_interaction.transaction_data.qr_code;
                        this.qrCode = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + res.point_of_interaction.transaction_data.qr_code_base64);
                    }
                    else {
                        localStorage.removeItem("idPagamento");
                        localStorage.removeItem("trabalhadorEscolhido");
                        localStorage.removeItem("tempoPagamento");
                        localStorage.removeItem("tempoAtual");
                        localStorage.removeItem("ValorDepositarCarteira");

                        clearInterval(this.id);

                        this.navCl.navigateRoot("inicial");
                    }
                }
                catch (erro: any) {
                    console.error(erro);

                    const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
                    alert.message = "Erro ao conectar-se ao servidor";
                    alert.present();
                }
                finally {
                    this.carregar = false;
                }
            }
        }

        PushNotifications.addListener("pushNotificationReceived", (notification: PushNotificationSchema) => {
            this.result = notification;
            this.situacao = this.result.data.situacaoServico;

            if (this.situacao == "false") {
                localStorage.removeItem("confirmacao");
                localStorage.removeItem("trabalhadorEscolhido");
                localStorage.removeItem("idPagamento");
                localStorage.removeItem("tempoPagamento");
                localStorage.removeItem("tempoAtual");
                localStorage.removeItem("ValorDepositarCarteira");

                clearInterval(this.id);

                this.navCl.navigateRoot("carteira-cliente");
            }
        });

        PushNotifications.addListener("pushNotificationActionPerformed", (res: ActionPerformed) => {
            this.result = res;
            this.situacao = this.result.data.situacaoServico;

            if (this.situacao == "false") {
                localStorage.removeItem("confirmacao");
                localStorage.removeItem("trabalhadorEscolhido");
                localStorage.removeItem("idPagamento");
                localStorage.removeItem("tempoPagamento");
                localStorage.removeItem("tempoAtual");
                localStorage.removeItem("ValorDepositarCarteira");

                clearInterval(this.id);

                this.navCl.navigateRoot("escolher-trabalhador");
            }
        });
    }

    async fazerPagamentoMp() {
        let solicitacao = JSON.parse(localStorage.getItem("solicitacao")!);
        let valor = localStorage.getItem("ValorDepositarCarteira");
        let cliente = JSON.parse(localStorage.getItem("cliente")!);

        let dataExpiracao = new Date();
        dataExpiracao.setMinutes(dataExpiracao.getMinutes() + 15);

        let link = dominio + "/Cliente/GerarPagamento";
        let dadosForm = new FormData();
        dadosForm.append("valorVisita", valor!);
        dadosForm.append("email", cliente.Email);
        dadosForm.append("cpf", cliente.Cpf);
        dadosForm.append("expiracao", dataExpiracao.toISOString());

        try {
            this.carregar = true;
            let res: any = await firstValueFrom(this.http.post(link, dadosForm, { headers: headerNgrok }));

            this.copiaCola = res.point_of_interaction.transaction_data.qr_code;
            this.qrCode = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + res.point_of_interaction.transaction_data.qr_code_base64);
            localStorage.setItem("idPagamento", res.id);
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
                link = dominio + "/Cliente/AtualizarSaldo";
                clearInterval(this.id);

                let valor = localStorage.getItem("ValorDepositarCarteira");
                let saldoAtual = this.cliente.SaldoCarteira;

                let dadosForm = new FormData();
                dadosForm.append("cpf", this.cliente.Cpf);
                dadosForm.append("valor", Number(valor) + saldoAtual);

                await firstValueFrom(this.http.post(link, dadosForm));

                this.cliente.SaldoCarteira = Number(valor) + saldoAtual;
                localStorage.setItem("cliente", JSON.stringify(this.cliente));

                localStorage.removeItem("ValorDepositarCarteira");
                localStorage.removeItem("idPagamento");
                localStorage.removeItem("tempoAtual");
                localStorage.removeItem("tempoPagamento");

                this.navCl.navigateRoot("carteira-cliente");
            }
            else if (res.status == "cancelled") {
                localStorage.removeItem("idPagamento");
                localStorage.removeItem("trabalhadorEscolhido");
                localStorage.removeItem("tempoPagamento");
                localStorage.removeItem("tempoAtual");
                localStorage.removeItem("ValorDepositarCarteira");

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
        const toast = document.querySelector("#toastPix") as HTMLIonToastElement;

        await Clipboard.write({
            string: this.copiaCola
        });

        toast.present();
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

                localStorage.removeItem("tempoPagamento");
                localStorage.removeItem("tempoAtual");
                localStorage.removeItem("trabalhadorEscolhido");
                localStorage.removeItem("idPagamento");
                localStorage.removeItem("ValorDepositarCarteira");

                this.navCl.navigateBack("/carteira-cliente");
            }
        }, 1000);
    }

}
