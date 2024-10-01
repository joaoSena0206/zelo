import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    constructor(private router: Router, private navCl: NavController) { }

    ngOnInit() {
        if (localStorage.getItem("logado") == "true") {
            if (localStorage.getItem("trabalhador")) {
                this.navCl.navigateRoot("trabalhador/inicial");
            }
            else {
                this.navCl.navigateRoot("inicial");
            }
        }
    }

    pagEntrar(opcao: string) {
        localStorage.setItem("opcao", opcao);
        this.router.navigateByUrl("/home/opcoes-de-cadastro");
    }
}