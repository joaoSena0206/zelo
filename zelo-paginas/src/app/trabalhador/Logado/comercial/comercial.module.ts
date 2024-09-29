import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComercialPageRoutingModule } from './comercial-routing.module';

import { ComercialPage } from './comercial.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComercialPageRoutingModule
  ],
  declarations: [ComercialPage]
})
export class ComercialPageModule {}
