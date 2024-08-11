import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadastroClientePageRoutingModule } from './cadastro-cliente-routing.module';

import { CadastroClientePage } from './cadastro-cliente.page';

import { MaskitoDirective } from '@maskito/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CadastroClientePageRoutingModule,
    MaskitoDirective
  ],
  declarations: [CadastroClientePage]
})
export class CadastroClientePageModule {}
