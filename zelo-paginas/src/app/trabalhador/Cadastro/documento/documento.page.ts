import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FilePicker } from '@capawesome/capacitor-file-picker';

@Component({
    selector: 'app-documento',
    templateUrl: './documento.page.html',
    styleUrls: ['./documento.page.scss'],
})
export class DocumentoPage implements OnInit {
    arquivos: any = [];
    imgSrc: any;

    constructor(private navCl: NavController) { }

    ngOnInit() {
    }

    voltarPag() {
        this.navCl.back();
    }

    abrirArquivo() {
        const pegarArquivos = async () => {
            const resultado = await FilePicker.pickFiles({
                types: ['image/png', 'image/jpeg', 'application/pdf'],
                limit: 1
            });
            const arquivo = resultado.files[0].blob;

            let obj = {
                arquivo: arquivo,
                mostrar: null
            };

            if (arquivo)
            {
                const reader = new FileReader();

                reader.onload = (e: any) => {
                    obj.mostrar = e.target.result;
                };

                reader.readAsDataURL(arquivo);
            }

            this.arquivos.push(obj)
        };

        pegarArquivos();
    }
}
