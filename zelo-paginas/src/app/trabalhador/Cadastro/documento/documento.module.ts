import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DocumentoPageRoutingModule } from './documento-routing.module';

import { DocumentoPage } from './documento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DocumentoPageRoutingModule
  ],
  declarations: [DocumentoPage]
})
export class DocumentoPageModule {}
