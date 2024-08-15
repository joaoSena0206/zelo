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
    path: 'termos',
    loadChildren: () => import('./geral/termos/termos.module').then( m => m.TermosPageModule)
  },
  {
    path: 'opcoes-de-cadastro',
    loadChildren: () => import('./geral/opcoes-de-cadastro/opcoes-de-cadastro.module').then( m => m.OpcoesDeCadastroPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }