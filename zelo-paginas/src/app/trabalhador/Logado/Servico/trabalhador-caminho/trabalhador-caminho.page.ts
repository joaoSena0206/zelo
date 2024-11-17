import { Component, OnInit } from '@angular/core';
import { PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';

@Component({
    selector: 'app-trabalhador-caminho',
    templateUrl: './trabalhador-caminho.page.html',
    styleUrls: ['./trabalhador-caminho.page.scss'],
})
export class TrabalhadorCaminhoPage implements OnInit {
    msgPoupopCancelar: any = 'Quer realmente cancelar o pedido?';
    msg: any = "Informe o motivo da denúncia";

    constructor() { }

    ngOnInit() {
        PushNotifications.addListener("pushNotificationReceived", (notification: PushNotificationSchema) => {
            let codigo = notification.data.codigo;
            localStorage.setItem("codigo", codigo);
        });
    }

    ionViewDidEnter() {
    }

    mudartxtCancelar() {
        let txtAdvertenciaCancelar = document.querySelector('.txt_cancelar_poupop') as HTMLTextAreaElement;
        let btnProsseguir = document.querySelector(".form__btn") as HTMLIonButtonElement;
        let modalCancelar = document.querySelector("#modal_cancelar") as HTMLIonModalElement;

        txtAdvertenciaCancelar.style.display = "none";

        this.msgPoupopCancelar = 'Pedido cancelado!';

        btnProsseguir.textContent = "Ok";
        btnProsseguir.addEventListener("click", function () {
            modalCancelar.dismiss();
        });
    }

    limpar() {
        this.msg = 'Informe o motivo da denuncia'
        this.msgPoupopCancelar = 'Quer realmente cancelar o pedido?';
    }

    mostrarBtnDenuncia() {
        const btn = document.querySelector(".btn_denunciar") as HTMLIonButtonElement;

        if (btn.style.display == "none") {
            btn.style.display = "block";
        }
        else {
            btn.style.display = "none";
        }
    }

    mudarOutro() {
        const accordion = document.querySelector(".grupo_selecao") as HTMLIonAccordionGroupElement;
        const popup = document.querySelector(".fundoPopup") as HTMLIonTextareaElement;

        accordion.style.display = "none";
        popup.style.display = "block";
    }

    //-----------------------------------------------------------------------------------------------------------//

    mudarOutro2() {
        const accordion = document.querySelector(".grupo_selecao") as HTMLIonAccordionGroupElement;
        const btn = document.querySelector("#btnDenuncia") as HTMLIonButtonElement;
        const modal = document.querySelector("#modal_denuncia") as HTMLIonModalElement;

        accordion.style.display = "none";
        const popup = document.querySelector(".fundoPopup") as HTMLIonTextareaElement;
        popup.style.display = "none";

        this.msg = 'Denúncia enviada com sucesso. Iremos avaliar a sua denúncia.';
        btn.textContent = "Ok";
        btn.addEventListener("click", function () {
            modal.dismiss();
        });
    }

    //-----------------------------------------------------------------------------------------------------------//

    abrirDivCodigo() {

        let div1 = document.querySelector('.div_1') as HTMLDivElement;
        let div2 = document.querySelector('.div_2') as HTMLDivElement;
        let div3 = document.querySelector('.div_3') as HTMLDivElement;
        let div4 = document.querySelector('.div_4') as HTMLDivElement;
        let divCodigo = document.querySelector('.div_codigo') as HTMLAreaElement;

        divCodigo.style.display = 'flex';

        div1.style.display = "none";
        div2.style.display = 'none';
        div3.style.display = 'none';
        div4.style.display = 'none';

    }

    fecharDivCodigo() {

        let div1 = document.querySelector('.div_1') as HTMLDivElement;
        let div2 = document.querySelector('.div_2') as HTMLDivElement;
        let div3 = document.querySelector('.div_3') as HTMLDivElement;
        let div4 = document.querySelector('.div_4') as HTMLDivElement;
        let divCodigo = document.querySelector('.div_codigo') as HTMLAreaElement;

        divCodigo.style.display = 'none';

        div1.style.display = "flex";
        div2.style.display = 'flex';
        div3.style.display = 'flex';
        div4.style.display = 'flex';
    }

    //-----------------------------------------------------------------------------------------------------------//

    verificarCodigo() {

        let div1 = document.querySelector('.div_1') as HTMLDivElement;
        let divCodigo = document.querySelector('.div_codigo') as HTMLAreaElement;
        let divTrabalhoIniciado = document.querySelector('.div_trabalho_iniciado') as HTMLDivElement;
        let divRelogio = document.querySelector('.div_relogio') as HTMLDivElement;

        divRelogio.style.display = 'flex';
        divTrabalhoIniciado.style.display = 'flex';
        divCodigo.style.display = 'none';
        div1.style.display = "flex";
    }

}
