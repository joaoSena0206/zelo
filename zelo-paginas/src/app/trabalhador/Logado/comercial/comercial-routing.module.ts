import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComercialPage } from './comercial.page';

const routes: Routes = [
  {
    path: '',
    component: ComercialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComercialPageRoutingModule {}
