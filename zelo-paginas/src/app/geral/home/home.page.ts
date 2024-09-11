import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    constructor(private router: Router) { }

    pagEntrar(opcao: string)
    {
        localStorage.setItem("opcao", opcao);
        this.router.navigateByUrl("/home/opcoes-de-cadastro");
    }

}
