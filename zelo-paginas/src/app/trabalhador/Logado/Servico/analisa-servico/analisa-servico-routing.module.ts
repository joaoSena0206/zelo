import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnalisaServicoPage } from './analisa-servico.page';

const routes: Routes = [
  {
    path: '',
    component: AnalisaServicoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnalisaServicoPageRoutingModule {}
