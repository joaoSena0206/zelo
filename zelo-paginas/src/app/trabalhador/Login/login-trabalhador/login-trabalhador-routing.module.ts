import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginTrabalhadorPage } from './login-trabalhador.page';

const routes: Routes = [
  {
    path: '',
    component: LoginTrabalhadorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginTrabalhadorPageRoutingModule {}
