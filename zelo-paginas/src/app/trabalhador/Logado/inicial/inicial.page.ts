import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-inicial',
  templateUrl: './inicial.page.html',
  styleUrls: ['./inicial.page.scss'],
})
export class InicialPage implements OnInit {
  situacao: any = 'Indisponível';
  msgTrabalho: any = 'Deseja trabalhar agora?';

  constructor() {}

  ngOnInit() {}

  disponivel() {
    const botaoSituacao = document.querySelector('#abrir_modal_servico');
    const img = document.querySelector('.img_btn_situacao');

    if (this.situacao == 'Disponível') {
      botaoSituacao?.classList.add('btn_situacao_trabalhador');
      botaoSituacao?.classList.remove('btn_situacao_trabalhador_disponivel');

      img?.setAttribute('src', '../../../assets/icon/Trabalhador/Icone inicial/IconeOff.svg');

      this.situacao = 'Indisponível';
      this.msgTrabalho = 'Deseja trabalhar agora?';
    } else {
      botaoSituacao?.classList.remove('btn_situacao_trabalhador');
      botaoSituacao?.classList.add('btn_situacao_trabalhador_disponivel');

      img?.setAttribute(
        'src',
        '../../../assets/icon/Trabalhador/Icone inicial/IconeAtivo.svg'
      );

      this.situacao = 'Disponível';
      this.msgTrabalho = 'Deseja parar de trabalhar?';
    }
  }
}
