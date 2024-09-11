import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmacaoTrabalhadorPage } from './confirmacao-trabalhador.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmacaoTrabalhadorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmacaoTrabalhadorPageRoutingModule {}
