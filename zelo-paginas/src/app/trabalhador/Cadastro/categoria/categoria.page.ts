import { Component, OnInit } from '@angular/core';
import { firstValueFrom, noop } from 'rxjs';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

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
        if (localStorage.getItem("trabalhador")) {
            let trabalhador = JSON.parse(localStorage.getItem("trabalhador")!);

            if (trabalhador.categorias) {
                const btns = document.querySelectorAll("ion-button");
                for (let i = 0; i < btns.length; i++) {

                    for (let j = 0; j < trabalhador.categorias.length; j++) {
                        if (btns[i].textContent == trabalhador.categorias[j]) {

                            btns[i].setAttribute("id", "marcado");

                        }
                    }

                }
            }
        }
    }

    ngOnInit() { }

    listaCategorias: any = []
    Nome: any = []

    async ionViewDidEnter(){
        await this.carregarServicos();
    }

    async carregarServicos(){
        this.carregar = true;
        let res = await firstValueFrom(this.http.get('http://localhost:57879/Servico/CarregarServicos'));
        this.carregar = false;
        this.listaCategorias = res;
    }

    marcador(event: Event): void{
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

        for (let i = 0; i < listaBotao2.length; i++) {

            if (listaBotao2[i].id == 'marcado') {
                texto = listaBotao2[i].textContent;
                categorias.push(texto);
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

                this.cadastrarBanco();

                this.navCl.navigateForward("/documento");
            }
        }
    }

    async cadastrarBanco() {
        let link = "http://localhost:57879/Trabalhador/AdicionarCategoria";
        let trabalhador = JSON.parse(localStorage.getItem("trabalhador")!);

        let dadosForm = new FormData();
        dadosForm.append("categoria", JSON.stringify(trabalhador.categoria));

        this.carregar = true;

        let res = await firstValueFrom(this.http.post(link, dadosForm, { responseType: "text" }));

        this.carregar = false;

        if (res == "ok") {
            this.navCl.navigateForward("/trabalhador/confirmar-celular");
        }
    }
}
