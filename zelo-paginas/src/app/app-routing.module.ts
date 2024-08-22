import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./geral/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'home/opcoes-de-cadastro',
    loadChildren: () => import('./geral/opcoes-de-cadastro/opcoes-de-cadastro.module').then( m => m.OpcoesDeCadastroPageModule)
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
    path: 'centralajuda',
    loadChildren: () => import('./geral/centralajuda/centralajuda.module').then( m => m.CentralajudaPageModule)
  },
  {
    path: 'suporte',
    loadChildren: () => import('./geral/suporte/suporte.module').then( m => m.SuportePageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./geral//chat/chat.module').then( m => m.ChatPageModule)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }