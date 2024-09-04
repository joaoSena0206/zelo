import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-trabalhador-caminho',
    templateUrl: './trabalhador-caminho.page.html',
    styleUrls: ['./trabalhador-caminho.page.scss'],
})
export class TrabalhadorCaminhoPage implements OnInit {

    constructor() { }

    ngOnInit() {
    }

    mudarOutro() {
        const accordion = document.querySelector(".grupo_selecao") as HTMLIonAccordionGroupElement;
        const popup = document.querySelector(".fundoPopup") as HTMLIonTextareaElement;

        accordion.style.display = "none";
        popup.style.display = "block";
    }

    //-----------------------------------------------------------------------------------------------------------//

    msg: any = 'Informe o motivo da denuncia';

    mudarOutro2() {
        const accordion = document.querySelector(".grupo_selecao") as HTMLIonAccordionGroupElement;
        accordion.style.display = "none";
        const popup = document.querySelector(".fundoPopup") as HTMLIonTextareaElement;
        popup.style.display = "none";
        
        this.msg = 'Denúncia enviada com sucesso. Iremos avaliar a sua denúncia.';
    }

    limpar(){
        this.msg = 'Informe o motivo da denuncia'
        this.msgPoupopCancelar = 'Quer realmente cancelar o pedido?';
    }

    //-----------------------------------------------------------------------------------------------------------//

    msgPoupopCancelar: any = 'Quer realmente cancelar o pedido?'

    mudartxtCancelar(){
        let txtAdvertenciaCancelar = document.querySelector('.txt_cancelar_poupop') as HTMLTextAreaElement;
        txtAdvertenciaCancelar.style.display = "none";

        this.msgPoupopCancelar = 'Pedido cancelado!';
    }

    iniciar(){

        let div1 = document.querySelector('.div1') as HTMLDivElement;
        let div2 = document.querySelector('.div2') as HTMLDivElement;
        let div3 = document.querySelector('.div3') as HTMLDivElement;
        let div4 = document.querySelector('.div4') as HTMLDivElement;
        let divCodigo = document.querySelector('.div_codigo') as HTMLAreaElement;

        console.log('oi')

        divCodigo.style.display = 'flex';

        div1.style.display = "none";
        div2.style.display = 'none';
        div3.style.display = 'none';
        div4.style.display = 'none';
        
    }

}
