import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagamentoCarteiraPage } from './pagamento-carteira.page';

const routes: Routes = [
  {
    path: '',
    component: PagamentoCarteiraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagamentoCarteiraPageRoutingModule {}
