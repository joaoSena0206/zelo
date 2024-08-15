import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnderecoPageRoutingModule } from './endereco-routing.module';

import { EnderecoPage } from './endereco.page';

import { MaskitoDirective } from '@maskito/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnderecoPageRoutingModule,
    MaskitoDirective,
    ReactiveFormsModule
  ],
  declarations: [EnderecoPage]
})
export class EnderecoPageModule {}
