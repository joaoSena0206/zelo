import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DescricaoServicoPageRoutingModule } from './descricao-servico-routing.module';

import { DescricaoServicoPage } from './descricao-servico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DescricaoServicoPageRoutingModule
  ],
  declarations: [DescricaoServicoPage]
})
export class DescricaoServicoPageModule {}
