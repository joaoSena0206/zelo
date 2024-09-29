import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UltimosPedidosPage } from './ultimos-pedidos.page';

const routes: Routes = [
  {
    path: '',
    component: UltimosPedidosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UltimosPedidosPageRoutingModule {}
