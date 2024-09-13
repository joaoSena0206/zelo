import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-inicial',
    templateUrl: './inicial.page.html',
    styleUrls: ['./inicial.page.scss'],
})
export class InicialPage implements OnInit {

    msgTrabalho: any = 'Deseja trabalhar agora?';

    constructor(private http: HttpClient) { }

    ngOnInit() { }

    cpf: any = 535305697
    situacao: any = '';
    resultado: any = '';
    

    ionViewDidEnter() {
        const botaoSituacao = document.querySelector('#abrir_modal_servico');
        const img = document.querySelector('.img_btn_situacao');

        this.http.post('http://localhost:57879/Trabalhador/VerificarSituacao', JSON.stringify(this.cpf), {responseType: 'text'}).subscribe(res => {

            if(res == "True")
            {
                this.situacao = 'Disponível';

                botaoSituacao?.classList.remove('btn_situacao_trabalhador');
                botaoSituacao?.classList.add('btn_situacao_trabalhador_disponivel');

                img?.setAttribute(
                    'src',
                    '../../../assets/icon/Trabalhador/Icone inicial/IconeAtivo.svg'
                );
            }
            else
            {
                botaoSituacao?.classList.add('btn_situacao_trabalhador');
                botaoSituacao?.classList.remove('btn_situacao_trabalhador_disponivel');

                img?.setAttribute('src', '../../../assets/icon/Trabalhador/Icone inicial/IconeOff.svg');

                this.situacao = 'Indisponível';
            }
        })

        
        const estrelas = document.querySelectorAll(".estrelas ion-icon");

        if (estrelas.length == 3)
        {
            (estrelas[1] as HTMLIonIconElement).style.marginBottom = "-20px";
        }
        else if (estrelas.length == 4)
        {
            (estrelas[1] as HTMLIonIconElement).style.marginBottom = "-20px";
            (estrelas[2] as HTMLIonIconElement).style.marginBottom = "-20px";
        }
        else if (estrelas.length == 5)
        {
            (estrelas[0] as HTMLIonIconElement).style.marginTop = "-20px";
            (estrelas[4] as HTMLIonIconElement).style.marginTop = "-20px";
            (estrelas[2] as HTMLIonIconElement).style.marginBottom = "-20px";
        }
    }

    disponivel() {
        const botaoSituacao = document.querySelector('#abrir_modal_servico');
        const img = document.querySelector('.img_btn_situacao');

        if (this.situacao == 'Disponível') {

            botaoSituacao?.classList.add('btn_situacao_trabalhador');
            botaoSituacao?.classList.remove('btn_situacao_trabalhador_disponivel');

            img?.setAttribute('src', '../../../assets/icon/Trabalhador/Icone inicial/IconeOff.svg');

            this.situacao = 'Indisponível';
            this.msgTrabalho = 'Deseja trabalhar agora?';

            this.resultado = false;

        } else {
            botaoSituacao?.classList.remove('btn_situacao_trabalhador');
            botaoSituacao?.classList.add('btn_situacao_trabalhador_disponivel');

            img?.setAttribute(
                'src',
                '../../../assets/icon/Trabalhador/Icone inicial/IconeAtivo.svg'
            );

            this.situacao = 'Disponível';
            this.msgTrabalho = 'Deseja parar de trabalhar?';

            this.resultado = true;
        }

        let link = "http://localhost:57879/Trabalhador/AtualizarSituacao";

        let dadosForm = new FormData();
        dadosForm.append("Resultado", this.resultado!);

        this.http.post(link, dadosForm, {responseType: 'text'}).subscribe(res => {
        })
        
    }
}
