import { Component, OnInit } from '@angular/core';
import { noop } from 'rxjs';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-categoria',
    templateUrl: './categoria.page.html',
    styleUrls: ['./categoria.page.scss'],
})
export class CategoriaPage implements OnInit {

    constructor(private navCl: NavController) {

    }

    voltarPag() {
        this.navCl.back();
    }

    ngAfterViewInit()
    {
        if (localStorage.getItem("trabalhador"))
        {
            let trabalhador = JSON.parse(localStorage.getItem("trabalhador")!);

            const btns = document.querySelectorAll("ion-button");
            for (let i = 0; i < btns.length; i++)
            {
                for (let j = 0; j < trabalhador.categorias.length; j++)
                {
                    if (btns[i].textContent == trabalhador.categorias[j])
                    {
                        btns[i].setAttribute("id", "marcado");
                    }
                }
            }
        }
    }

    ngOnInit() {
        let listaBotao = document.querySelectorAll('.geralCard ion-card ion-button')

        for (let i = 0; i < listaBotao.length; i++) {

            listaBotao[i].addEventListener('click', marcado)

            function marcado() {
                let botao = listaBotao[i];
                let texto = botao.textContent;

                if (botao.id == 'marcado') {
                    botao.id = 'desmarcado';
                }
                else {
                    botao.id = 'marcado';
                }
            }
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

                this.navCl.navigateForward("/documento");
            }
        }
    }
}
