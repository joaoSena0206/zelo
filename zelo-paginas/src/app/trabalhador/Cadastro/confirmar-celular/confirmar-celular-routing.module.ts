import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmarCelularPage } from './confirmar-celular.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmarCelularPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmarCelularPageRoutingModule {}
