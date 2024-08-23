import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'descricao-servico',
		pathMatch: 'full'
	},
	{
		path: 'home',
		loadChildren: () => import('./geral/home/home.module').then(m => m.HomePageModule)
	},
	{
		path: 'home/opcoes-de-cadastro',
		loadChildren: () => import('./geral/opcoes-de-cadastro/opcoes-de-cadastro.module').then(m => m.OpcoesDeCadastroPageModule)
	},
	{
		path: 'termos',
		loadChildren: () => import('./geral/termos/termos.module').then(m => m.TermosPageModule)
	},
	{
		path: 'cadastro-cliente',
		loadChildren: () => import('./cliente/cadastro/cadastro-cliente/cadastro-cliente.module').then(m => m.CadastroClientePageModule)
	},
	{
		path: 'login-cliente',
		loadChildren: () => import('./cliente/login/login-cliente/login-cliente.module').then(m => m.LoginClientePageModule)
	},
	{
		path: 'endereco',
		loadChildren: () => import('./cliente/cadastro/endereco/endereco.module').then(m => m.EnderecoPageModule)
	},
	{
		path: 'confirmar-celular',
		loadChildren: () => import('./cliente/cadastro/confirmar-celular/confirmar-celular.module').then(m => m.ConfirmarCelularPageModule)
	},
	{
		path: 'recuperar-senha',
		loadChildren: () => import('./cliente/login/recuperar-senha/recuperar-senha.module').then(m => m.RecuperarSenhaPageModule)
	},
	{
		path: 'inicial',
		loadChildren: () => import('./cliente/logado/inicial/inicial.module').then(m => m.InicialPageModule)
	},
	{
		path: 'trabalhos',
		loadChildren: () => import('./cliente/logado/trabalhos/trabalhos.module').then(m => m.TrabalhosPageModule)
	},
	{
		path: 'perfil',
		loadChildren: () => import('./cliente/logado/perfil-cliente/perfil/perfil.module').then(m => m.PerfilPageModule)
	},
	{
		path: 'privacidade',
		loadChildren: () => import('./cliente/logado/perfil-cliente/privacidade/privacidade.module').then(m => m.PrivacidadePageModule)
	},
	{
		path: 'historico',
		loadChildren: () => import('./cliente/logado/perfil-cliente/historico/historico.module').then(m => m.HistoricoPageModule)
	},
	{
		path: 'favoritos',
		loadChildren: () => import('./cliente/logado/perfil-cliente/favoritos/favoritos.module').then(m => m.FavoritosPageModule)
	},
	{
		path: 'perfil-trabalhador',
		loadChildren: () => import('./cliente/logado/perfil-trabalhador/perfil-trabalhador.module').then(m => m.PerfilTrabalhadorPageModule)
	},
	{
		path: 'descricao-servico',
		loadChildren: () => import('./cliente/logado/descricao-servico/descricao-servico.module').then(m => m.DescricaoServicoPageModule)
	},



];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }