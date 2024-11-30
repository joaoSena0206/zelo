import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, firstValueFrom } from 'rxjs';
import { NavController } from '@ionic/angular';
import { dominio, headerNgrok } from 'src/app/gerais';
import {
    ActionPerformed,
    PushNotificationSchema,
    PushNotifications,
    Token,
} from '@capacitor/push-notifications';

@Component({
    selector: 'app-inicial',
    templateUrl: './inicial.page.html',
    styleUrls: ['./inicial.page.scss'],
})
export class InicialPage implements OnInit {
    cliente: any = JSON.parse(localStorage.getItem("cliente")!);
    categorias: any;
    patrocinados: any;
    historico: any;
    carregar: boolean = false;
    mostrar: boolean = true;
    dominio: any = dominio;
    listaEndereco: any = [];
    saldo: any;

    constructor(private http: HttpClient, private navCl: NavController) { }

    ngOnInit() {
        this.pegarSaldo();
        this.carregarCategorias();
        this.carregarPatrocinados();
        this.carregarHistorico();
        this.buscarEndereco();

        PushNotifications.requestPermissions().then(result => {
            if (result.receive === "granted") {
                PushNotifications.register();
            }
            else {
                console.error("Necessário notificação");
            }
        });

        PushNotifications.addListener("registration", (token: Token) => {
            this.enviarToken(token.value);
        });

        if (localStorage.getItem("confirmacao")) {
            this.navCl.navigateRoot("confirmacao-trabalhador");
        }
        else if (localStorage.getItem("idPagamento")) {
            this.navCl.navigateRoot("pagamento");
        }
        else {
            localStorage.removeItem("solicitacao");
            localStorage.removeItem("servico");
            localStorage.removeItem("endereco");
        }
    }

    async pegarSaldo() {
        let link = dominio + "/Cliente/PegarSaldo?cpf=" + this.cliente.Cpf;
        let res: any = await firstValueFrom(this.http.get(link));

        this.saldo = res;
        localStorage.setItem("saldoCarteira", res); 
    }

    async buscarEndereco() {
        let link = dominio + "/Cliente/BuscarEndereco";
        let dadosForm = new FormData();
        dadosForm.append("cpf", this.cliente.Cpf);

        try {
            this.carregar = true;

            let res = await firstValueFrom(this.http.post(link, dadosForm));

            this.carregar = false;

            this.listaEndereco = res;

            localStorage.setItem('endereco', JSON.stringify(this.listaEndereco));
        }
        catch {
            const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
            alert.message = "Erro ao conectar-se ao servidor";
            alert.present();
        }
    }

    async enviarToken(token: any) {
        let link = dominio + "/Cliente/AdicionarTokenFCM";
        let cliente = JSON.parse(localStorage.getItem("cliente")!);
        let dadosForm = new FormData();
        dadosForm.append("cpf", cliente.Cpf);
        dadosForm.append("token", token);

        try {
            let resposta = await firstValueFrom(this.http.post(link, dadosForm, { headers: headerNgrok }));
        }
        catch {
            const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
            alert.message = "Erro ao conectar-se ao servidor";
            alert.present();
        }
    }

    async carregarPatrocinados() {
        let link = dominio + "/Patrocinio/CarregarPatrocinados";

        try {
            let res = await firstValueFrom(this.http.get(link, { headers: headerNgrok }));

            this.patrocinados = res;
        }
        catch {
            const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
            alert.message = "Erro ao conectar-se ao servidor";
            alert.present();
        }
    }

    async carregarHistorico() {
        let cliente = JSON.parse(localStorage.getItem("cliente")!);
        let link = dominio + `/SolicitacaoServico/CarregarUltimosPedidos?cpf=${cliente.Cpf}&tipo=cliente`;

        try {
            let res = await firstValueFrom(this.http.get(link, { headers: headerNgrok }));

            this.historico = res;
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

    async carregarCategorias() {
        let link = dominio + "/CategoriaServico/CarregarCategoria";

        this.carregar = true;

        try {
            let res = await firstValueFrom(this.http.get(link, { headers: headerNgrok }));
            this.categorias = res;

            if (this.categorias != null) {
                link = dominio + "/Servico/CarregarServicos";

                let res2 = await firstValueFrom(this.http.get(link, { headers: headerNgrok }));

                let servicos: any = res2;
                servicos.sort((a: any, b: any) => {
                    if (a.Nome < b.Nome) {
                        return -1;
                    }
                    if (a.Nome > b.Nome) {
                        return 1;
                    }

                    return 0;
                });

                if (servicos != null) {
                    for (let i = 0; i < this.categorias.length; i++) {
                        this.categorias[i].servicos = [];

                        for (let j = 0; j < servicos.length; j++) {
                            if (this.categorias[i].Codigo == servicos[j].Categoria.Codigo) {
                                this.categorias[i].servicos.push(servicos[j]);
                            }
                        }
                    }
                }
            }
        }
        catch {
            const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
            alert.message = "Erro ao conectar-se ao servidor";
            alert.present();
        }
    }

    mostrarTrabalhos() {
        this.navCl.navigateForward("/trabalhos");
    }

    trackByPedido(index: number, pedido: any): any {
        return pedido.Trabalhador.Cpf;
    }

    pesquisarServicos(input: any) {
        const cards = document.querySelectorAll(".local_ultimos_trabalhos ion-card");

        let valor = input.value.toLowerCase();

        if (valor == "") {
            this.mostrar = true;
        }
        else {
            this.mostrar = false;
        }

        for (let i = 0; i < cards.length; i++) {
            if (valor == "") {
                if (i < 5) {
                    cards[i].classList.remove("escondido");
                }
                else {
                    cards[i].classList.add("escondido");
                }
            }
            else {

                if (cards[i].textContent?.toLowerCase().includes(valor)) {
                    cards[i].classList.remove("escondido");
                }
                else {
                    cards[i].classList.add("escondido");
                }
            }
        }
    }

    selecionarServico(servico: any) {
        localStorage.setItem("servico", JSON.stringify(servico));

        this.navCl.navigateForward("/descricao-servico");
    }

    VerPerfil(Cpf: any, Nome: any) {
        let clienteVerPerfil = { Cpf: Cpf, Nome: Nome }
        localStorage.setItem('perfil', JSON.stringify(clienteVerPerfil))
        this.navCl.navigateBack("/perfil-trabalhador")
    }
}
