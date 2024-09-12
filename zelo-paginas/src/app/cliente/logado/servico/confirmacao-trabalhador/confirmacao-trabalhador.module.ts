import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmacaoTrabalhadorPageRoutingModule } from './confirmacao-trabalhador-routing.module';

import { ConfirmacaoTrabalhadorPage } from './confirmacao-trabalhador.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmacaoTrabalhadorPageRoutingModule
  ],
  declarations: [ConfirmacaoTrabalhadorPage]
})
export class ConfirmacaoTrabalhadorPageModule {}
