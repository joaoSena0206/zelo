/* import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-confirmar-celular',
  templateUrl: './confirmar-celular.page.html',
  styleUrls: ['./confirmar-celular.page.scss'],
})
export class ConfirmarCelularPage implements OnInit {

  cd1: any;
  cd2: any;
  cd3: any;
  cd4: any;
  cd5: any;

  @ViewChild('input1') input1: ElementRef;
  @ViewChild('input2') input2: ElementRef;
  @ViewChild('input3') input3: ElementRef;
  @ViewChild('input4') input4: ElementRef;
  @ViewChild('input5') input5: ElementRef;

  inputs: { [key: string]: ElementRef } = {};

  constructor() { }

  ngOnInit() { }

  Confirmar() {

    if ((this.cd1 == undefined) && (this.cd2 == undefined) && (this.cd3 == undefined) && (this.cd4 == undefined) && (this.cd5 == undefined)) {
      console.log('erro')
    }
    else {
      let codigo = this.cd1 + this.cd2 + this.cd3 + this.cd4 + this.cd5;

      console.log(codigo)

      async function enviarDadosCodigo(codigo: any) {
        try 
        {
          const formData = new FormData;
          formData.append('categoria', codigo);

          const response = await fetch('http://www.nsa.sp.gov.br', {
            method: 'post',
            body: formData
          });

          const data = await response.json();
          console.log(data);
        }
        catch (error) 
        {
          console.log('erro ao buscar os dados!', error);
        }
      }

      enviarDadosCodigo(codigo);
    }
  }

  moveFocus(event: Event, nextInputId: string) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.value.length >= inputElement.maxLength) {

      if (nextInputId && this.inputs[nextInputId]) {

        this.inputs[nextInputId].nativeElement.focus();

      }
    }
  }

}
 */

import { Component, input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
/* import { TermosPageModule } from 'src/app/geral/termos/termos.module'; */

@Component({
  selector: 'app-confirmar-celular',
  templateUrl: './confirmar-celular.page.html',
  styleUrls: ['./confirmar-celular.page.scss'],
})
export class ConfirmarCelularPage implements OnInit {
  tempo: number = 60;

  constructor(private navCl: NavController) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    const inputs = document.querySelectorAll("ion-input");

    for (let i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener("ionInput", function () {
        let apagado = false;

        if (/[^\d]/g.test(inputs[i].value?.toString()!)) {
          apagado = true;
        }

        inputs[i].value = inputs[i].value?.toString().replace(/[^\d]/g, "");

        if (inputs[i].value != "" && i != inputs.length - 1 && apagado == false) {
          inputs[i + 1].setFocus();
        }
        else if (inputs[i].value == "" && i != 0 && apagado == false) {
          inputs[i - 1].setFocus();
        }
      });
    }
  }

  ionViewDidEnter() {
    const btns = document.querySelectorAll(".form__btn");
    const btnReenviar = document.querySelector(".form__btn--reenviar");

    if ((btns[0] as HTMLIonButtonElement).offsetHeight != (btns[1] as HTMLIonButtonElement).offsetHeight) {
      (btns[0] as HTMLIonButtonElement).style.height = (btns[1] as HTMLIonButtonElement).offsetHeight + "px";
    }

    window.addEventListener("resize", function () {
      const btns = document.querySelectorAll(".form__btn");

      if ((btns[0] as HTMLIonButtonElement).offsetHeight != (btns[1] as HTMLIonButtonElement).offsetHeight) {
        (btns[0] as HTMLIonButtonElement).style.height = (btns[1] as HTMLIonButtonElement).offsetHeight + "px";
      }
    });

    const intervalo = setInterval(() => {
      this.tempo -= 1;

      if (this.tempo == 0) {
        clearInterval(intervalo);
      }
    }, 1000);
  }

  voltarPag() {
    this.navCl.back();
  }

  ionViewWillEnter() {
    if (localStorage.getItem("trabalhador")) {
      /* if (this.form.controls['cpf'].value == "") {
        let Trabalhador = JSON.parse(localStorage.getItem("trabalhador")!);

        this.form.controls['nome'].setValue(Trabalhador.nome);
        this.form.controls['cpf'].setValue(Trabalhador.cpf);
        this.form.controls['data'].setValue(Trabalhador.dataNascimento);
        this.form.controls['email'].setValue(Trabalhador.email);
        this.form.controls['senhas'].controls['senha'].setValue(Trabalhador.senha);
        this.form.controls['senhas'].controls['confirmarSenha'].setValue(Trabalhador.senha);

        this.mostrarData();
      } */
    }
  }

  cd1: any;
  cd2: any;
  cd3: any;
  cd4: any;
  cd5: any;

  enviar() {

    if ((this.cd1 == undefined) && (this.cd2 == undefined) && (this.cd3 == undefined) && (this.cd4 == undefined) && (this.cd5 == undefined)) {
      console.log('erro')
    }
    else {
      let codigo = this.cd1 + this.cd2 + this.cd3 + this.cd4 + this.cd5;

      let trabalhador = JSON.parse(localStorage.getItem("trabalhador")!);

      localStorage.setItem("endereco", codigo);

      this.navCl.navigateForward("/documento");
      
    }
  }
}