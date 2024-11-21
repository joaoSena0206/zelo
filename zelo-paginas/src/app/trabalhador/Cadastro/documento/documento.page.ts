import { Component, OnInit, Sanitizer, SecurityContext } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FileOpener } from '@capawesome-team/capacitor-file-opener';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { dominio, headerNgrok } from 'src/app/gerais';
import { Capacitor } from '@capacitor/core';
import { Filesystem } from '@capacitor/filesystem';

@Component({
    selector: 'app-documento',
    templateUrl: './documento.page.html',
    styleUrls: ['./documento.page.scss'],
})
export class DocumentoPage implements OnInit {
    arquivos: any = [];
    imgSrc: any;
    carregar: boolean = false;

    constructor(private navCl: NavController, private sanitizer: DomSanitizer, private http: HttpClient) { }

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
            const arquivo = resultado.files[0];
            let caminho = Capacitor.convertFileSrc(arquivo.path!);
            let resposta = await fetch(caminho);
            let arquivoBlob = await resposta.blob();

            interface objSafeUrl {
                id: any,
                arquivo: any,
                img: any,
                pdf: any
            }

            let obj: objSafeUrl = {
                id: null,
                arquivo: null,
                img: null,
                pdf: null
            };

            obj.arquivo = arquivo;

            if (arquivoBlob) {
                const reader = new FileReader();

                reader.onload = (e: any) => {
                    if (arquivoBlob.type == "image/png" || arquivoBlob.type == "image/jpeg") {
                        obj.img = e.target.result;
                    }
                    else {
                        obj.pdf = this.sanitizer.bypassSecurityTrustResourceUrl(e.target.result)!;
                    }
                };

                reader.readAsDataURL(arquivoBlob);
            }

            this.arquivos.push(obj)
        };

        pegarArquivos();
    }

    async enviarArquivos() {
        let link = dominio + "/Trabalhador/AdicionarSaque";
        let trabalhador = JSON.parse(localStorage.getItem("trabalhador")!);
        let dadosForm = new FormData();
        dadosForm.append("cpf", trabalhador.Cpf);
        dadosForm.append("pix", trabalhador.pix);
        dadosForm.append("valor", trabalhador.valor);
        try {
            this.carregar = true;

            let res = await firstValueFrom(this.http.post(link, dadosForm, { headers: headerNgrok }));

            if (res == null) {
                link = dominio + "/Trabalhador/AdicionarCategoria";

                dadosForm = new FormData();
                dadosForm.append("cpf", trabalhador.Cpf);
                dadosForm.append("categorias", JSON.stringify(trabalhador.categorias));

                res = await firstValueFrom(this.http.post(link, dadosForm, { responseType: "text", headers: headerNgrok }));

                if (res == "") {
                    if (this.arquivos.length != 0) {
                        link = dominio + "/Trabalhador/AdicionarCertificado"
                        dadosForm = new FormData();
                        dadosForm.append("cpf", trabalhador.Cpf);

                        for (let i = 0; i < this.arquivos.length; i++) {
                            const fileData = this.arquivos[i].arquivo;

                            // Valida se o arquivo tem um caminho
                            if (!fileData.path) {
                                console.error(`Arquivo ${i} não possui um caminho válido`);
                                continue;
                            }

                            // Lê o arquivo usando o Capacitor Filesystem
                            const fileResult = await Filesystem.readFile({
                                path: fileData.path,
                            });

                            // Verifica se os dados do arquivo foram lidos corretamente
                            if (!fileResult.data) {
                                console.error(`Erro ao ler o arquivo ${fileData.path}`);
                                continue;
                            }

                            // Converte para Blob
                            const byteCharacters = atob(fileResult.data.toString()); // Decodifica Base64
                            const byteNumbers = [];
                            for (let j = 0; j < byteCharacters.length; j++) {
                                byteNumbers.push(byteCharacters.charCodeAt(j));
                            }
                            const byteArray = new Uint8Array(byteNumbers);
                            const blob = new Blob([byteArray], { type: fileData.mimeType });

                            if (this.arquivos[i].arquivo.mimeType.includes("image")) {
                                dadosForm.append("files", blob, i + ".jpg");
                            }
                            else {
                                dadosForm.append("files", blob, i + ".pdf");
                            }
                        }

                        res = await firstValueFrom(this.http.post(link, dadosForm, { headers: headerNgrok }));

                        if (res == null) {
                            localStorage.removeItem("trabalhador");

                            this.navCl.navigateRoot("/login-trabalhador");
                        }

                    }
                    else {
                        localStorage.removeItem("trabalhador");

                        this.navCl.navigateRoot("/login-trabalhador");
                    }
                }
            }
        }
        catch (erro: any) {
            console.error(erro);
            const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
            alert.message = "Erro ao conectar-se ao servidor";
            alert.present();
        }
        finally {
            this.carregar = false;
        }

    }

    async cadastrarCategoria() {
        let link = dominio + "/Trabalhador/AdicionarCategoria";
        let trabalhador = JSON.parse(localStorage.getItem("trabalhador")!);

        let dadosForm = new FormData();
        dadosForm.append("categorias", JSON.stringify(trabalhador.categorias));

        try {
            this.carregar = true;
            let res = await firstValueFrom(this.http.post(link, dadosForm, { responseType: "text", headers: headerNgrok }));
        }
        catch (erro: any) {
            console.error(erro);
            const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
            alert.message = "Erro ao conectar-se ao servidor";
            alert.present();
        }
        finally {
            this.carregar = false;
        }
    }

    removerArquivo(event: any) {
        let nomeArquivo = event.parentElement.children[0].children[1].textContent;

        for (let i = 0; i < this.arquivos.length; i++) {
            if (nomeArquivo == this.arquivos[i].arquivo.name) {
                this.arquivos.splice(i, 1);
            }
        }
    }
}
