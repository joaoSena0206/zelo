import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrabalhadorCaminhoPageRoutingModule } from './trabalhador-caminho-routing.module';

import { TrabalhadorCaminhoPage } from './trabalhador-caminho.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrabalhadorCaminhoPageRoutingModule
  ],
  declarations: [TrabalhadorCaminhoPage]
})
export class TrabalhadorCaminhoPageModule {}
