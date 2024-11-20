import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrivacidadePageRoutingModule } from './privacidade-routing.module';

import { PrivacidadePage } from './privacidade.page';

import { MaskitoDirective } from '@maskito/angular';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaskitoDirective,
    PrivacidadePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PrivacidadePage]
})
export class PrivacidadePageModule {}
