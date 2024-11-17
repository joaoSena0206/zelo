import { Component, OnInit } from '@angular/core';
import { firstValueFrom, noop } from 'rxjs';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { dominio, headerNgrok } from 'src/app/gerais';

@Component({
    selector: 'app-categoria',
    templateUrl: './categoria.page.html',
    styleUrls: ['./categoria.page.scss'],
})
export class CategoriaPage implements OnInit {

    carregar: boolean = false;

    constructor(private navCl: NavController, private http: HttpClient) { }

    voltarPag() {
        this.navCl.back();
    }

    ngAfterViewInit() {

    }

    async ngOnInit() {
        await this.carregarServicos();
    }

    listaCategorias: any = []
    Nome: any = []

    ionViewDidEnter() {
        if (localStorage.getItem("trabalhador")) {
            let trabalhador = JSON.parse(localStorage.getItem("trabalhador")!);

            if (trabalhador.categorias) {
                const btns = document.querySelectorAll("ion-button");
                for (let i = 0; i < btns.length; i++) {

                    for (let j = 0; j < trabalhador.categorias.length; j++) {
                        if (btns[i].textContent == trabalhador.categorias[j].Nome) {

                            btns[i].setAttribute("id", "marcado");

                        }
                    }

                }
            }
        }
    }

    async carregarServicos() {
        try
        {
            this.carregar = true;
            let res = await firstValueFrom(this.http.get(dominio + '/Servico/CarregarServicos', {headers: headerNgrok}));
            this.listaCategorias = res;
        }
        catch (erro: any) {
            const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
            alert.message = "Erro ao conectar-se ao servidor";
            alert.present();
        }
        finally {
            this.carregar = false;
        }
    }

    marcador(event: Event): void {
        const BotatClicado = event.target as HTMLIonButtonElement;

        if (BotatClicado.id == 'marcado') {
            BotatClicado.id = 'desmarcado';
        }
        else {
            BotatClicado.id = 'marcado';
        }
    }

    enviar() {
        let listaBotao2 = document.querySelectorAll('.geralCard ion-card ion-button')
        let texto: any;
        let categorias: any = []
        let codigo: any;

        for (let i = 0; i < listaBotao2.length; i++) {

            if (listaBotao2[i].id == 'marcado') {
                texto = listaBotao2[i].textContent;
                codigo = listaBotao2[i].parentElement?.id;

                let categoria = {
                    Codigo: Number(codigo),
                    Nome: texto
                };

                categorias.push(categoria);
            }
        }

        if (categorias.length == 0) {
            console.log('erro')
        }
        else {
            if (localStorage.getItem("trabalhador")) {
                let trabalhadorStorage = JSON.parse(localStorage.getItem("trabalhador")!);
                trabalhadorStorage.categorias = categorias;

                localStorage.setItem("trabalhador", JSON.stringify(trabalhadorStorage));

                this.navCl.navigateForward("/documento");
            }
        }
    }

    async cadastrarBanco() {
        let link = dominio + "/Trabalhador/AdicionarCategoria";
        let trabalhador = JSON.parse(localStorage.getItem("trabalhador")!);

        let dadosForm = new FormData();
        dadosForm.append("categorias", JSON.stringify(trabalhador.categorias));

        try
        {
            this.carregar = true;
            let res = await firstValueFrom(this.http.post(link, dadosForm, { responseType: "text", headers: headerNgrok }));

            if (res == "ok") {
                this.navCl.navigateForward("/trabalhador/confirmar-celular");
            }
        }
        catch (erro: any) {
            const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
            alert.message = "Erro ao conectar-se ao servidor";
            alert.present();
        }
        finally {
            this.carregar = false;
        }
    }
}
