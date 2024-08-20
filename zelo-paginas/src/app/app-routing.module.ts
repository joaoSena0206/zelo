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
    loadChildren: () => import('./trabalhador/Logado/inicial/inicial.module').then( m => m.InicialPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./trabalhador/Logado/Perfil-trabalhador/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'privacidade',
    loadChildren: () => import('./trabalhador/Logado/Perfil-trabalhador/privacidade/privacidade.module').then( m => m.PrivacidadePageModule)
  },
  {
    path: 'ultimos-pedidos',
    loadChildren: () => import('./trabalhador/Logado/Perfil-trabalhador/ultimos-pedidos/ultimos-pedidos.module').then( m => m.UltimosPedidosPageModule)
  },
  {
    path: 'certificado',
    loadChildren: () => import('./trabalhador/Logado/Perfil-trabalhador/certificado/certificado.module').then( m => m.CertificadoPageModule)
  },
  {
    path: 'perfil-cliente',
    loadChildren: () => import('./trabalhador/Logado/perfil-cliente/perfil-cliente.module').then( m => m.PerfilClientePageModule)
  }










];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }