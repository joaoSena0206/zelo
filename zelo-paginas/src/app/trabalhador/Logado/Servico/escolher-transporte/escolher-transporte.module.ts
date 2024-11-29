import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EscolherTransportePageRoutingModule } from './escolher-transporte-routing.module';

import { EscolherTransportePage } from './escolher-transporte.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EscolherTransportePageRoutingModule
  ],
  declarations: [EscolherTransportePage]
})
export class EscolherTransportePageModule {}
