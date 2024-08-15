import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicial',
  templateUrl: './inicial.page.html',
  styleUrls: ['./inicial.page.scss'],
})
export class InicialPage implements OnInit {

  

  constructor() { }

  ngOnInit() {
  }

  disponivel()
  {
    const botaoSituacao = document.querySelector("#open-custom-dialog");
    botaoSituacao?.classList.remove("btn_situacao_trabalhador");
    botaoSituacao?.classList.add('btn_situacao_trabalhador_disponivel');

    const img = document.querySelector(".img_btn_situacao");
    img?.setAttribute("src", "../../../assets/icon/Trabalhador/IconeAtivo.svg");

    let txtSituacao = document.querySelector(".txtSituacao")?.textContent;

  }

}
