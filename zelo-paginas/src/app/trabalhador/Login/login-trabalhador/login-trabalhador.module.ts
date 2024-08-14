import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginTrabalhadorPageRoutingModule } from './login-trabalhador-routing.module';

import { LoginTrabalhadorPage } from './login-trabalhador.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginTrabalhadorPageRoutingModule
  ],
  declarations: [LoginTrabalhadorPage]
})
export class LoginTrabalhadorPageModule {}
