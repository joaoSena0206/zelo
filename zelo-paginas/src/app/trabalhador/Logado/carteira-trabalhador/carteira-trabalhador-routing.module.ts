import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarteiraTrabalhadorPage } from './carteira-trabalhador.page';

const routes: Routes = [
  {
    path: '',
    component: CarteiraTrabalhadorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarteiraTrabalhadorPageRoutingModule {}
