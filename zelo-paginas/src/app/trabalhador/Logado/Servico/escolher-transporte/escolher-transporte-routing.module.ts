import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EscolherTransportePage } from './escolher-transporte.page';

const routes: Routes = [
  {
    path: '',
    component: EscolherTransportePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EscolherTransportePageRoutingModule {}
