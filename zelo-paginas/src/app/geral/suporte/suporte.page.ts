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
    let tempo_em_ms = 2500 //teste Breno
    
    setTimeout(() => {
      this.modal.dismiss();
    }, tempo_em_ms);
  }
  
  validarcampos(){
    const nomeInput = document.getElementById("nomeInput") as HTMLIonInputElement;
    const emailInput = document.getElementById("emailInput") as HTMLIonInputElement;
    const duvidaInput = document.getElementById("duvidaInput") as HTMLIonInputElement;
    const textoerroform = document.querySelector('.escondido') as HTMLParagraphElement;
    const card = document.querySelector('.card') as HTMLIonCardElement;


    console.log()

    /* for (let i = 0; i < card.length; i++) {
      const element = card[i];
      
    } */

    duvidaInput.style.border = '';
    emailInput.style.border = '';
    nomeInput.style.border = '';
    textoerroform.style.display = 'none';

    if(nomeInput.value == "")
    {
      nomeInput.style.border = '2px solid red';
      textoerroform.style.display = 'flex';
    }
    else
    {
      if(emailInput.value == "")
      {
        emailInput.style.border = '2px solid red';
        textoerroform.style.display = 'flex';
      }
      else
      {
        if(duvidaInput.value == "")
        {
          duvidaInput.style.border = '2px solid red';
          textoerroform.style.display = 'flex';
        }
      }
    }

 }

  ngOnInit() {
  }

}