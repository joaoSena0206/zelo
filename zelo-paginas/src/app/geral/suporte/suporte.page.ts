import { HtmlTagDefinition } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';


@Component({
  selector: 'app-suporte',
  templateUrl: './suporte.page.html',
  styleUrls: ['./suporte.page.scss'],
})


export class SuportePage implements OnInit {

  @ViewChild('modal_enviado_com_sucesso', { static: true }) modal: IonModal;

  constructor() { }

  abrirModal() {
    this.modal.present();
    let tempo_em_ms = 2300 //teste Breno
    
    setTimeout(() => {
      this.modal.dismiss();
    }, tempo_em_ms);
  }
  
  validarcampos(){
    const nomeInput = document.getElementById("nomeInput") as HTMLIonInputElement;
    const emailInput = document.getElementById("emailInput") as HTMLIonInputElement;
    const duvidaInput = document.getElementById("duvidaInput") as HTMLIonInputElement;
    const textoerroform = document.querySelector('.escondido') as HTMLParagraphElement;
    const textoerroform2 = document.querySelector('.escondido2') as HTMLParagraphElement;
    const textoerroform3 = document.querySelector('.escondido3') as HTMLParagraphElement;
    const ionmodal = document.getElementById('modal_servico_solicitado') as HTMLIonModalElement;


    console.log()

    /* for (let i = 0; i < card.length; i++) {
      const element = card[i];
      
    } */

    duvidaInput.style.border = '';
    emailInput.style.border = '';
    nomeInput.style.border = '';
    textoerroform.style.display = 'none';
    textoerroform2.style.display = 'none';
    textoerroform3.style.display = 'none';
    let verificar = false;

    if(nomeInput.value == "")
    {
      nomeInput.style.border = '2px solid red';
      textoerroform.style.display = 'flex';
      verificar = false
    }
    else
    {
      verificar = true;
    }

    if(emailInput.value == "")
    {
      emailInput.style.border = '2px solid red';
      textoerroform2.style.display = 'flex';
      verificar = false
    }
    else
    {
      verificar = true;
    }

    if(duvidaInput.value == "")
    {
      duvidaInput.style.border = '2px solid red';
      textoerroform3.style.display = 'flex';
      verificar = false
    }
    else
    {
      verificar = true;
    }


    if(verificar == true)
    {
      this.abrirModal();
    }



    
    /* if(nomeInput.value == "")
    {
      ionmodal.style.display = 'none';
    }
    {
      ionmodal.style.display = 'flex';
    } */

 }

  ngOnInit() {
  }

}