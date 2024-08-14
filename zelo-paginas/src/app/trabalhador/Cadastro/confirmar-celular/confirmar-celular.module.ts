import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmarCelularPageRoutingModule } from './confirmar-celular-routing.module';

import { ConfirmarCelularPage } from './confirmar-celular.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmarCelularPageRoutingModule
  ],
  declarations: [ConfirmarCelularPage]
})
export class ConfirmarCelularPageModule {}
