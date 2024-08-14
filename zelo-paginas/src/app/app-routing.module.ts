import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginTrabalhadorPageModule } from './trabalhador/Login/login-trabalhador/login-trabalhador.module';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./geral/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },



  {
    path: 'cadastro-cliente',
    loadChildren: () => import('./cliente/cadastro-cliente/cadastro-cliente.module').then( m => m.CadastroClientePageModule)
  },
  {
    path: 'cadastro-trabalhador',
    loadChildren: () => import('./trabalhador/Cadastro/cadastro-trabalhador/cadastro-trabalhador.module').then( m => m.CadastroTrabalhadorPageModule)
  },
  {
    path: 'confirmar-celular',
    loadChildren: () => import('./trabalhador/Cadastro/confirmar-celular/confirmar-celular.module').then( m => m.ConfirmarCelularPageModule)
  },
  {
    path: 'tipo-saque',
    loadChildren: () => import('./trabalhador/Cadastro/tipo-saque/tipo-saque.module').then( m => m.TipoSaquePageModule)
  },
  {
    path: 'documento',
    loadChildren: () => import('./trabalhador/Cadastro/documento/documento.module').then( m => m.DocumentoPageModule)
  },
  {
    path: 'categoria',
    loadChildren: () => import('./trabalhador/Cadastro/categoria/categoria.module').then( m => m.CategoriaPageModule)
  },
  {
    path: 'login-trabalhador',
    loadChildren: () => import('./trabalhador/Login/login-trabalhador/login-trabalhador.module').then( m => m.LoginTrabalhadorPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }