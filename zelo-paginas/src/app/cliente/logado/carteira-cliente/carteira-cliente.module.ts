import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarteiraClientePageRoutingModule } from './carteira-cliente-routing.module';

import { CarteiraClientePage } from './carteira-cliente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarteiraClientePageRoutingModule
  ],
  declarations: [CarteiraClientePage]
})
export class CarteiraClientePageModule {}
