import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OpcoesDeCadastroPage } from './opcoes-de-cadastro.page';

const routes: Routes = [
  {
    path: '',
    component: OpcoesDeCadastroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpcoesDeCadastroPageRoutingModule {}
