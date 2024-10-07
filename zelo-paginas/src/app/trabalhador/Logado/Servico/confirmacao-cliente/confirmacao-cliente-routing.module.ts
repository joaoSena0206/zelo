import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmacaoClientePage } from './confirmacao-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmacaoClientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmacaoClientePageRoutingModule {}
