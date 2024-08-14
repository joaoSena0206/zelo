import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocumentoPage } from './documento.page';

const routes: Routes = [
  {
    path: '',
    component: DocumentoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentoPageRoutingModule {}
