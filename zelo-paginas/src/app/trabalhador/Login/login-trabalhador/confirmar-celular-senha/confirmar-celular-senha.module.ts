import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmarCelularSenhaPageRoutingModule } from './confirmar-celular-senha-routing.module';

import { ConfirmarCelularSenhaPage } from './confirmar-celular-senha.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmarCelularSenhaPageRoutingModule
  ],
  declarations: [ConfirmarCelularSenhaPage]
})
export class ConfirmarCelularSenhaPageModule {}
