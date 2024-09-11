import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilTrabalhadorPageRoutingModule } from './perfil-trabalhador-routing.module';

import { PerfilTrabalhadorPage } from './perfil-trabalhador.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilTrabalhadorPageRoutingModule
  ],
  declarations: [PerfilTrabalhadorPage]
})
export class PerfilTrabalhadorPageModule {}
