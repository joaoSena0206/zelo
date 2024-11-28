import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarteiraClientePage } from './carteira-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: CarteiraClientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarteiraClientePageRoutingModule {}
