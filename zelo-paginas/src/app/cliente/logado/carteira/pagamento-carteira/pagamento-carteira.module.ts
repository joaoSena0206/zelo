import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PagamentoCarteiraPageRoutingModule } from './pagamento-carteira-routing.module';

import { PagamentoCarteiraPage } from './pagamento-carteira.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PagamentoCarteiraPageRoutingModule
  ],
  declarations: [PagamentoCarteiraPage]
})
export class PagamentoCarteiraPageModule {}
