import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'cadastro-cliente',
    pathMatch: 'full'
  },
  {
    path: 'cadastro-cliente',
    loadChildren: () => import('./cliente/cadastro-cliente/cadastro-cliente.module').then( m => m.CadastroClientePageModule)
  },
  {
    path: 'login-cliente',
    loadChildren: () => import('./cliente/login-cliente/login-cliente.module').then( m => m.LoginClientePageModule)
  },
  {
    path: 'endereco',
    loadChildren: () => import('./cliente/endereco/endereco.module').then( m => m.EnderecoPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }