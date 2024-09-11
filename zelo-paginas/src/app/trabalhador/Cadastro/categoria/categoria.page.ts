import { Component, OnInit } from '@angular/core';
import { noop } from 'rxjs';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.page.html',
  styleUrls: ['./categoria.page.scss'],
})
export class CategoriaPage implements OnInit {

  constructor() {
    
   }

  ngOnInit() {
    let listaBotao = document.querySelectorAll('.geralCard ion-card ion-button')

    for (let i = 0; i < listaBotao.length; i++) {
      
      listaBotao[i].addEventListener('click', marcado)

      function marcado(){
        let botao = listaBotao[i];
        let texto = botao.textContent;

        if(botao.id == 'marcado')
        {
          botao.id = 'desmarcado';
        }
        else
        {
          botao.id = 'marcado';
        }
      }
    }
  }


  Salvar(){

    let listaBotao2 = document.querySelectorAll('.geralCard ion-card ion-button')
    let texto: any;
    let lista: any = []

    for (let i = 0; i < listaBotao2.length; i++) {

        if(listaBotao2[i].id == 'marcado')
        {
          texto = listaBotao2[i].textContent;
          lista.push(texto);
        }
    }

    if(lista.length == 0)
    {
      console.log('erro')
    }

    let categoria = lista;
    
    async function enviarDadosUsuario(categoria: any) {
        try
        {
            const formData = new FormData;
            formData.append('categoria', categoria);

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

    enviarDadosUsuario(categoria);

  }

}
