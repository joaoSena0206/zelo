import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadastroTrabalhadorPage } from './cadastro-trabalhador.page';

const routes: Routes = [
  {
    path: '',
    component: CadastroTrabalhadorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastroTrabalhadorPageRoutingModule {}
