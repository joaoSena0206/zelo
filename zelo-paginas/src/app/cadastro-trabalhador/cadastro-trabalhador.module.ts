import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadastroTrabalhadorPageRoutingModule } from './cadastro-trabalhador-routing.module';

import { CadastroTrabalhadorPage } from './cadastro-trabalhador.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CadastroTrabalhadorPageRoutingModule
  ],
  declarations: [CadastroTrabalhadorPage]
})
export class CadastroTrabalhadorPageModule {}
