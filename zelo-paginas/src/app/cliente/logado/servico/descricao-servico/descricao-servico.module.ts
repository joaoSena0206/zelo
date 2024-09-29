import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DescricaoServicoPageRoutingModule } from './descricao-servico-routing.module';

import { DescricaoServicoPage } from './descricao-servico.page';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DescricaoServicoPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [DescricaoServicoPage]
})
export class DescricaoServicoPageModule {}
