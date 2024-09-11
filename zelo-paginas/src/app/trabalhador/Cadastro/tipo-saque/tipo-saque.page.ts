import { Component, OnInit } from '@angular/core';
import { MaskitoOptions, MaskitoElementPredicate, maskitoTransform } from '@maskito/core';


@Component({
  selector: 'app-tipo-saque',
  templateUrl: './tipo-saque.page.html',
  styleUrls: ['./tipo-saque.page.scss'],
})
export class TipoSaquePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  readonly phoneMask: MaskitoOptions = {
    mask: ['+', '1', ' ', '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
  };

  //If you need to set an initial value, you can use maskitoTransform to ensure the value is valid
  myPhoneNumber = maskitoTransform('5555551212', this.phoneMask);

  readonly cardMask: MaskitoOptions = {
    mask: [
      ...Array(4).fill(/\d/),
      ' ',
      ...Array(4).fill(/\d/),
      ' ',
      ...Array(4).fill(/\d/),
      ' ',
      ...Array(4).fill(/\d/),
      ' ',
      ...Array(3).fill(/\d/),
    ],
  };

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

}
