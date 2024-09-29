import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TipoSaquePageRoutingModule } from './tipo-saque-routing.module';

import { TipoSaquePage } from './tipo-saque.page';

import { ReactiveFormsModule } from '@angular/forms'; 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TipoSaquePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [TipoSaquePage]
})
export class TipoSaquePageModule {}
