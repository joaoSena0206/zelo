import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OpcoesDeCadastroPageRoutingModule } from './opcoes-de-cadastro-routing.module';

import { OpcoesDeCadastroPage } from './opcoes-de-cadastro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OpcoesDeCadastroPageRoutingModule
  ],
  declarations: [OpcoesDeCadastroPage]
})
export class OpcoesDeCadastroPageModule {}
