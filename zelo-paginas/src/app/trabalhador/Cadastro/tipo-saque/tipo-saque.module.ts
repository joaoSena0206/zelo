import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TipoSaquePageRoutingModule } from './tipo-saque-routing.module';

import { TipoSaquePage } from './tipo-saque.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TipoSaquePageRoutingModule
  ],
  declarations: [TipoSaquePage]
})
export class TipoSaquePageModule {}
