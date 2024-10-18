import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-privacidade',
  templateUrl: './privacidade.page.html',
  styleUrls: ['./privacidade.page.scss'],
})
export class PrivacidadePage implements OnInit {

  trabalhador: any;

  constructor() { }

  ngOnInit() {
    
  }

  ngAfterViewInit(){
    this.pegarDados();
  }

  pegarDados(){
    this.trabalhador = JSON.parse(localStorage.getItem("trabalhador")!)
    let cpf = this.trabalhador.Cpf
    console.log(this.trabalhador)
  }

}
