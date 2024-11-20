import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Renderer2 } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.page.html',
    styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
    cliente: any = JSON.parse(localStorage.getItem("cliente")!);
    trabalhador: any = JSON.parse(localStorage.getItem("trabalhador")!);
    solicitacao: any = JSON.parse(localStorage.getItem("solicitacao")!);
    msgOuvida: Subscription;

    constructor(private renderer: Renderer2, private firestore: AngularFirestore, private navCl: NavController) { }

    ngOnInit() {


    }

    voltarPag() {
        this.navCl.navigateRoot("/trabalhador-caminho");
    }

    ionViewDidEnter() {
        this.msgOuvida = this.firestore.collection("chats").doc(this.solicitacao.CdSolicitacaoServico.toString()).collection("msgs", (ref) => ref.orderBy('data', 'asc')).stateChanges(['added']).subscribe((res: any) => {
            res.forEach((dado: any) => {
                let data = new Date().getTime();
                let cdSolicitacao = this.solicitacao.CdSolicitacaoServico;
                let dados = dado.payload.doc.data();

                if (dados.tipo != "cliente") {
                    const divMsgs = this.renderer.selectRootElement(".divMsgs", true);

                    const divGeral = this.renderer.createElement("div");
                    this.renderer.addClass(divGeral, "geral");

                    const divImg = this.renderer.createElement("div");
                    this.renderer.addClass(divImg, "img");

                    const icone = this.renderer.createElement("ion-icon");
                    this.renderer.addClass(icone, "imgDele");
                    this.renderer.setStyle(icone, "display", "block");
                    this.renderer.setAttribute(icone, "name", "person-circle-outline");
                    this.renderer.appendChild(divImg, icone);

                    const div = this.renderer.createElement("div");
                    this.renderer.addClass(div, "msgDele");

                    const p = this.renderer.createElement("p");
                    this.renderer.appendChild(p, this.renderer.createText(dados.texto));

                    this.renderer.appendChild(div, p);
                    this.renderer.appendChild(divGeral, divImg);
                    this.renderer.appendChild(divGeral, div);
                    this.renderer.appendChild(divMsgs, divGeral);
                }
                else {
                    const divMsgs = this.renderer.selectRootElement(".divMsgs", true);
                    const div = this.renderer.createElement("div");
                    this.renderer.addClass(div, "msgMinha");

                    const p = this.renderer.createElement("p");
                    this.renderer.appendChild(p, this.renderer.createText(dados.texto));

                    this.renderer.appendChild(div, p);
                    this.renderer.appendChild(divMsgs, div);
                }
            });
        });
    }

    ngOnDestroy() {
        this.msgOuvida.unsubscribe();
    }

    enviarMsg(valor: any) {
        let data = new Date().getTime();
        let cdSolicitacao = this.solicitacao.CdSolicitacaoServico;
        let msg = {
            texto: valor,
            remetente: this.cliente.Cpf,
            data: data,
            tipo: "cliente"
        };

        this.firestore.collection("chats").doc(cdSolicitacao.toString()).collection("msgs").add(msg);
    }
}
