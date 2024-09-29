import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnalisaServicoPageRoutingModule } from './analisa-servico-routing.module';

import { AnalisaServicoPage } from './analisa-servico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnalisaServicoPageRoutingModule
  ],
  declarations: [AnalisaServicoPage]
})
export class AnalisaServicoPageModule {}
