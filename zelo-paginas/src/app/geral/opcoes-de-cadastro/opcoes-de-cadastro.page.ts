import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
    selector: 'app-opcoes-de-cadastro',
    templateUrl: './opcoes-de-cadastro.page.html',
    styleUrls: ['./opcoes-de-cadastro.page.scss'],
})
export class OpcoesDeCadastroPage implements OnInit {

    constructor(private router: Router) { }

    ngOnInit() {
        if (localStorage.getItem("opcao") == null) {
            this.router.navigateByUrl("/home");
        }
    }

    proxPag(opcao: string) {
        this.router.navigateByUrl(`/${localStorage.getItem("opcao")}-${opcao}`);
    }

    pagAnterior() {
        this.router.navigateByUrl("/home");
    }
}
