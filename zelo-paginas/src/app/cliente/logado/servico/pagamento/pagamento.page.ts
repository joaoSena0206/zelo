import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { first, firstValueFrom } from 'rxjs';
import { dominio, headerNgrok } from 'src/app/gerais';
import { DomSanitizer } from '@angular/platform-browser';
import { Clipboard } from '@capacitor/clipboard';
import { ActionPerformed, PushNotificationSchema, PushNotifications, Token } from '@capacitor/push-notifications';

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
    result: any;
    situacao: any;

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

                let solicitacao = JSON.parse(localStorage.getItem("solicitacao")!);
                if (solicitacao.Trabalhador != null) {
                    solicitacao.Trabalhador.Cpf = null;
                }

                this.enviarCancelamento();

                localStorage.removeItem("tempoPagamento");
                localStorage.removeItem("tempoAtual");
                localStorage.removeItem("trabalhadorEscolhido");
                localStorage.removeItem("idPagamento");

                this.navCl.navigateRoot("/escolher-trabalhador");
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

                        clearInterval(this.id);
                        this.enviarCancelamento();

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

                clearInterval(this.id);

                this.navCl.navigateRoot("escolher-trabalhador");
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

                clearInterval(this.id);

                this.navCl.navigateRoot("escolher-trabalhador");
            }
        });
    }

    async enviarCancelamento() {
        let trabalhador = JSON.parse(localStorage.getItem("trabalhadorEscolhido")!);
        let cliente = JSON.parse(localStorage.getItem("cliente")!);
        let link = dominio + "/Cliente/EnviarPagamentoCancelado";
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
                localStorage.removeItem("tempoAtual");

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

                this.enviarCancelamento();

                localStorage.removeItem("tempoPagamento");
                localStorage.removeItem("tempoAtual");
                localStorage.removeItem("trabalhadorEscolhido");
                localStorage.removeItem("idPagamento");

                this.navCl.navigateBack("/escolher-trabalhador");
            }
        }, 1000);
    }
}
