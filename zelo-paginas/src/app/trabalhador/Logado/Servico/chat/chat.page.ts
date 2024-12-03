import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavController } from '@ionic/angular';
import { Renderer2 } from '@angular/core';
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
    msgAnterior: any;
    msgOuvida: Subscription;

    constructor(private firestore: AngularFirestore, private renderer: Renderer2, private navCl: NavController) { }

    ngOnInit() {
        const divMsgs = this.renderer.selectRootElement(".divMsgs", true);


        this.msgOuvida = this.firestore.collection("chats").doc(this.solicitacao.CdSolicitacaoServico.toString()).collection("msgs", (ref) => ref.orderBy('data', 'asc')).stateChanges(['added']).subscribe((res: any) => {
            res.forEach((dado: any) => {
                let dados = dado.payload.doc.data();

                if (dados.tipo == "cliente") {
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
                    let data = new Date().getTime();
                    let cdSolicitacao = this.solicitacao.CdSolicitacaoServico;

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

    ionViewDidEnter() {

    }

    voltarPag() {
        this.navCl.back();
    }

    enviarMsg(valor: any) {
        let data = new Date().getTime();
        let cdSolicitacao = this.solicitacao.CdSolicitacaoServico;
        let msg = {
            texto: valor,
            remetente: this.trabalhador.Cpf,
            data: data,
            tipo: "trabalhador"
        };
        this.msgAnterior = msg;

        this.firestore.collection("chats").doc(cdSolicitacao.toString()).collection("msgs").add(msg);
    }
}
