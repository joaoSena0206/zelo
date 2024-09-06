import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

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
