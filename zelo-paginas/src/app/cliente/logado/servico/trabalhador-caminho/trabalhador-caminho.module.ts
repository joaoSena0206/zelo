import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrabalhadorCaminhoPageRoutingModule } from './trabalhador-caminho-routing.module';

import { TrabalhadorCaminhoPage } from './trabalhador-caminho.page';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrabalhadorCaminhoPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [TrabalhadorCaminhoPage]
})
export class TrabalhadorCaminhoPageModule {}
