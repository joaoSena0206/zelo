import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./geral/home/home.module').then( m => m.HomePageModule)
  },
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
    path: 'cadastro-trabalhador',
    loadChildren: () => import('./trabalhador/cadastro-trabalhador/cadastro-trabalhador.module').then( m => m.CadastroTrabalhadorPageModule)
  },
  {
    path: 'termos',
    loadChildren: () => import('./geral/termos/termos.module').then( m => m.TermosPageModule)
  },
  {
    path: 'login-cliente',
    loadChildren: () => import('./cliente/login-cliente/login-cliente.module').then( m => m.LoginClientePageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
