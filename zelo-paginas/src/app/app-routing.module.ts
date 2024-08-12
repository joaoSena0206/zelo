import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

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
    loadChildren: () => import('./trabalhador/cadastro-trabalhador/cadastro-trabalhador.module').then( m => m.CadastroTrabalhadorPageModule)
  },
  {
    path: 'confirmar-celular',
    loadChildren: () => import('./trabalhador/confirmar-celular/confirmar-celular.module').then( m => m.ConfirmarCelularPageModule)
  },
  {
    path: 'tipo-saque',
    loadChildren: () => import('./trabalhador/tipo-saque/tipo-saque.module').then( m => m.TipoSaquePageModule)
  },
  {
    path: 'documento',
    loadChildren: () => import('./trabalhador/documento/documento.module').then( m => m.DocumentoPageModule)
  }



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }