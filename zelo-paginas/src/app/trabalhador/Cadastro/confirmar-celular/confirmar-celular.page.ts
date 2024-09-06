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

  ngOnInit() {
    this.inputs = {
      input1: this.input1,
      input2: this.input2,
      input3: this.input3,
      input4: this.input4,
      input5: this.input5,
    };
  }

  Confirmar(){
    let lista = [];

    lista.push(this.cd1);
    lista.push(this.cd2);
    lista.push(this.cd3);
    lista.push(this.cd4);
    lista.push(this.cd5);

    console.log(lista);

    async function enviarDadosCodigo(lista: any) {
      try
      {
          const formData = new FormData;
          formData.append('categoria', lista);

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

  enviarDadosCodigo(lista);
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
