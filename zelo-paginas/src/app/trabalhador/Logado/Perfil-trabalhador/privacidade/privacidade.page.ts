import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { ViewChild, ElementRef } from '@angular/core';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-privacidade',
  templateUrl: './privacidade.page.html',
  styleUrls: ['./privacidade.page.scss'],
})
export class PrivacidadePage implements OnInit {

  @ViewChild('inputField', { static: false }) inputField: IonInput;

  trabalhador: any = JSON.parse(localStorage.getItem("trabalhador")!);
  novoTexto: any;
  isDisabled = true;

  constructor(private eRef: ElementRef) { }

  ngOnInit() { }


  ngAfterViewInit() {
    this.pegarDados();
  }

  pegarDados() {
    const dateString: string = this.trabalhador.DataNascimento;
      const timestamp: number = Date.parse(dateString);
      const date: Date = new Date(timestamp);

      let dia = date.getDate();
      let mes = date.getMonth() + 1;
      let ano = date.getFullYear();

      let DataFormatada = null;

      if(mes < 10)
      {
        DataFormatada = dia + "/" + "0" + mes + "/" + ano;
      }
      else
      {
        DataFormatada = dia + "/" + mes + "/" + ano;
      }

      this.novoTexto = DataFormatada;
  }

  abilitarInput(inputElement: any){
    this.isDisabled = false;
    let inputNome = document.querySelector('#inputNome') as HTMLIonInputElement;
    inputNome.style.border = 'black 1px solid'
    this.inputField.setFocus();
  }

  disabilitarInput() {
  }

  inputValue: string = '';
  isDisabled2 = true;

  onInputChange(event: any) {
    const newValue = event.detail.value;
    console.log('Novo valor do input:', newValue);
    this.isDisabled = true;
    let inputNome = document.querySelector('#inputNome') as HTMLIonInputElement;
    inputNome.style.border = 'none';
  }

  onInputChange2(event: KeyboardEvent) {
    const newValue = (event.target as HTMLInputElement).value;
    this.isDisabled2 = false;
  }

}
