import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UltimosPedidosPageRoutingModule } from './ultimos-pedidos-routing.module';

import { UltimosPedidosPage } from './ultimos-pedidos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UltimosPedidosPageRoutingModule
  ],
  declarations: [UltimosPedidosPage]
})
export class UltimosPedidosPageModule {}
