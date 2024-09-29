import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EscolherTrabalhadorPageRoutingModule } from './escolher-trabalhador-routing.module';

import { EscolherTrabalhadorPage } from './escolher-trabalhador.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EscolherTrabalhadorPageRoutingModule
  ],
  declarations: [EscolherTrabalhadorPage]
})
export class EscolherTrabalhadorPageModule {}
