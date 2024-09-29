import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadastroTrabalhadorPageRoutingModule } from './cadastro-trabalhador-routing.module';

import { CadastroTrabalhadorPage } from './cadastro-trabalhador.page';

import { MaskitoDirective } from '@maskito/angular';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CadastroTrabalhadorPageRoutingModule,
    MaskitoDirective,
    ReactiveFormsModule
  ],
  declarations: [CadastroTrabalhadorPage]
})
export class CadastroTrabalhadorPageModule {}
