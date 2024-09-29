import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DescricaoServicoPage } from './descricao-servico.page';

const routes: Routes = [
  {
    path: '',
    component: DescricaoServicoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DescricaoServicoPageRoutingModule {}
