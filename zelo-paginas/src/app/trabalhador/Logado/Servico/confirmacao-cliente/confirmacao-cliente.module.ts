import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmacaoClientePageRoutingModule } from './confirmacao-cliente-routing.module';

import { ConfirmacaoClientePage } from './confirmacao-cliente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmacaoClientePageRoutingModule
  ],
  declarations: [ConfirmacaoClientePage]
})
export class ConfirmacaoClientePageModule {}
