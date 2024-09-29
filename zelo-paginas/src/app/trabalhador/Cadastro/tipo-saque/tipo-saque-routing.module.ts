import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TipoSaquePage } from './tipo-saque.page';

const routes: Routes = [
  {
    path: '',
    component: TipoSaquePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TipoSaquePageRoutingModule {}
