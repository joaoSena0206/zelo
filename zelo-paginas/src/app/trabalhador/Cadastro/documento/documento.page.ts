import { Component, OnInit, Sanitizer, SecurityContext } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FileOpener } from '@capawesome-team/capacitor-file-opener';

@Component({
    selector: 'app-documento',
    templateUrl: './documento.page.html',
    styleUrls: ['./documento.page.scss'],
})
export class DocumentoPage implements OnInit {
    arquivos: any = [];
    imgSrc: any;

    constructor(private navCl: NavController, private sanitizer: DomSanitizer) { }

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

            interface objSafeUrl {
                arquivo: any,
                img: any,
                pdf: any
            }

            let obj: objSafeUrl = {
                arquivo: null,
                img: null,
                pdf: null
            };

            obj.arquivo = arquivo;

            if (arquivo) {
                const reader = new FileReader();

                reader.onload = (e: any) => {
                    if (arquivo.type == "image/png" || arquivo.type == "image/jpeg") {
                        obj.img = e.target.result;
                    }
                    else {
                        obj.pdf = this.sanitizer.bypassSecurityTrustResourceUrl(e.target.result)!;
                    }
                };

                reader.readAsDataURL(arquivo);
            }

            this.arquivos.push(obj)
        };

        pegarArquivos();
    }

    mostrarArquivo(elem: any) {
        for (let i = 0; i < this.arquivos.length; i++) {
            if (this.arquivos[i].img === elem.src || this.arquivos[i].pdf === elem.data) {
                const open = async () => {
                    await FileOpener.openFile({
                        blob: this.arquivos[i].arquivo
                    });
                };

                open();
            }
        }
    }
}
