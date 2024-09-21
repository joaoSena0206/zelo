import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-documento',
    templateUrl: './documento.page.html',
    styleUrls: ['./documento.page.scss'],
})
export class DocumentoPage implements OnInit {

    constructor(private navCl: NavController) { }

    ngOnInit() {
    }

    voltarPag()
    {
        this.navCl.back();
    }

}
