import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginTrabalhadorPageModule } from './trabalhador/Login/login-trabalhador/login-trabalhador.module';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'inicial',
    pathMatch: 'full'
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
  },
  {
    path: 'recuperar-senha',
    loadChildren: () => import('./trabalhador/Login/recuperar-senha/recuperar-senha.module').then( m => m.RecuperarSenhaPageModule)
  },
  {
    path: 'inicial',
    loadChildren: () => import('./trabalhador/inicial/inicial.module').then( m => m.InicialPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./trabalhador/perfil/perfil.module').then( m => m.PerfilPageModule)
  }






];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }