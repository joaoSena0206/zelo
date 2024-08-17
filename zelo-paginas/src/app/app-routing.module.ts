import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'trabalhos',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./geral/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'home/opcoes-de-cadastro',
    loadChildren: () => import('./geral/opcoes-de-cadastro/opcoes-de-cadastro.module').then( m => m.OpcoesDeCadastroPageModule)
  },
  {
    path: 'termos',
    loadChildren: () => import('./geral/termos/termos.module').then( m => m.TermosPageModule)
  },
  {
    path: 'cadastro-cliente',
    loadChildren: () => import('./cliente/cadastro/cadastro-cliente/cadastro-cliente.module').then( m => m.CadastroClientePageModule)
  },
  {
    path: 'login-cliente',
    loadChildren: () => import('./cliente/login/login-cliente/login-cliente.module').then( m => m.LoginClientePageModule)
  },
  {
    path: 'endereco',
    loadChildren: () => import('./cliente/cadastro/endereco/endereco.module').then( m => m.EnderecoPageModule)
  },
  {
    path: 'confirmar-celular',
    loadChildren: () => import('./cliente/cadastro/confirmar-celular/confirmar-celular.module').then( m => m.ConfirmarCelularPageModule)
  },
  {
    path: 'recuperar-senha',
    loadChildren: () => import('./cliente/login/recuperar-senha/recuperar-senha.module').then( m => m.RecuperarSenhaPageModule)
  },
  {
    path: 'inicial',
    loadChildren: () => import('./cliente/logado/inicial/inicial.module').then( m => m.InicialPageModule)
  },
  {
    path: 'trabalhos',
    loadChildren: () => import('./cliente/logado/trabalhos/trabalhos.module').then( m => m.TrabalhosPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }