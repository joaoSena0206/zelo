import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarteiraTrabalhadorPageRoutingModule } from './carteira-trabalhador-routing.module';

import { CarteiraTrabalhadorPage } from './carteira-trabalhador.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarteiraTrabalhadorPageRoutingModule
  ],
  declarations: [CarteiraTrabalhadorPage]
})
export class CarteiraTrabalhadorPageModule {}
