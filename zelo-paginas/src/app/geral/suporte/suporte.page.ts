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
    const textoerroform = document.querySelector('p.escondido') as HTMLParagraphElement;
   

    let camposValidos = true;

    if (nomeInput.value === "") 
    {
      nomeInput.style.border = '2px solid red';
      textoerroform.classList.remove('escondido');
      camposValidos = false;
    } 
    else 
    {
      nomeInput.style.border = '';
      textoerroform.classList.add('escondido');
      camposValidos = true;
    }

    if (emailInput.value === "") 
      {
        emailInput.style.border = '2px solid red';
        textoerroform.classList.remove('escondido');
        camposValidos = false;
      } 
      else 
      {
        emailInput.style.border = '';
        camposValidos = true;
        textoerroform.classList.add('escondido');
        
      }

        if (duvidaInput.value === "") 
    {
      duvidaInput.style.border = '2px solid red';
      textoerroform.classList.remove('escondido');
      camposValidos = false;
    } 
    else 
    {
      duvidaInput.style.border = '';
      camposValidos = true;
    }
 }

  ngOnInit() {
  }

}