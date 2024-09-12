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

    const nomeValor = nomeInput.value;
    const emailValor = emailInput.value;
    const duvidaValor = duvidaInput.value;

    if(verificar == true)
    {
      nomeInput.value = "";
      emailInput.value = "";
      duvidaInput.value = "";
      this.abrirModal();
      console.log(nomeValor, emailValor, duvidaValor) 
    }
    
    
  /* 
    async function buscarDadosForms(nomeValor:any, emailValor:any, duvidaValor:any){
    try
      {
        const formData = new FormData;
        formData.append( 'nome', nomeValor);
        formData.append('email', emailValor);
        formData.append( 'duvida', duvidaValor);
  
        const response = await fetch('https://www.nsa.sp.gov.br', {
        method: 'post',
        body: formData
        });
  
        const data = await response.json();
        console.log(data)
  
      }
      catch (error)
      {
        console.log('erro ao buscas estes dados!', error)
      }
    }
      
    buscarDadosForms(nomeValor, emailValor, duvidaValor); */

 }

  EnviarDadosForms(){
  }

  ngOnInit() {
  }

}