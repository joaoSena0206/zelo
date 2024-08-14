import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmarCelularSenhaPage } from './confirmar-celular-senha.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmarCelularSenhaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmarCelularSenhaPageRoutingModule {}
