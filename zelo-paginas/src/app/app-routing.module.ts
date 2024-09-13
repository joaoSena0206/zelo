import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
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
        loadChildren: () => import('./cliente/logado/servico/descricao-servico/descricao-servico.module').then(m => m.DescricaoServicoPageModule)
    },
    {
        path: 'escolher-trabalhador',
        loadChildren: () => import('./cliente/logado/servico/escolher-trabalhador/escolher-trabalhador.module').then(m => m.EscolherTrabalhadorPageModule)
    },
    {
        path: 'pagamento',
        loadChildren: () => import('./cliente/logado/servico/pagamento/pagamento.module').then(m => m.PagamentoPageModule)
    },
    {
        path: 'confirmacao-trabalhador',
        loadChildren: () => import('./cliente/logado/servico/confirmacao-trabalhador/confirmacao-trabalhador.module').then(m => m.ConfirmacaoTrabalhadorPageModule)
    },
    {
        path: 'trabalhador-caminho',
        loadChildren: () => import('./cliente/logado/servico/trabalhador-caminho/trabalhador-caminho.module').then(m => m.TrabalhadorCaminhoPageModule)
    },
    {
        path: 'avaliacao',
        loadChildren: () => import('./cliente/logado/servico/avaliacao/avaliacao.module').then(m => m.AvaliacaoPageModule)
    },
    {
        path: 'centralajuda',
        loadChildren: () => import('./geral/centralajuda/centralajuda.module').then(m => m.CentralajudaPageModule)
    },
    {
        path: 'suporte',
        loadChildren: () => import('./geral/suporte/suporte.module').then(m => m.SuportePageModule)
    },
    {
        path: 'chat',
        loadChildren: () => import('./geral//chat/chat.module').then(m => m.ChatPageModule)
    },
    {
        path: 'cadastro-trabalhador',
        loadChildren: () => import('./trabalhador/Cadastro/cadastro-trabalhador/cadastro-trabalhador.module').then(m => m.CadastroTrabalhadorPageModule)
    },
    {
        path: 'trabalhador/confirmar-celular',
        loadChildren: () => import('./trabalhador/Cadastro/confirmar-celular/confirmar-celular.module').then(m => m.ConfirmarCelularPageModule)
    },
    {
        path: 'tipo-saque',
        loadChildren: () => import('./trabalhador/Cadastro/tipo-saque/tipo-saque.module').then(m => m.TipoSaquePageModule)
    },
    {
        path: 'documento',
        loadChildren: () => import('./trabalhador/Cadastro/documento/documento.module').then(m => m.DocumentoPageModule)
    },
    {
        path: 'categoria',
        loadChildren: () => import('./trabalhador/Cadastro/categoria/categoria.module').then(m => m.CategoriaPageModule)
    },
    {
        path: 'login-trabalhador',
        loadChildren: () => import('./trabalhador/Login/login-trabalhador/login-trabalhador.module').then(m => m.LoginTrabalhadorPageModule)
    },
    {
        path: 'trabalhador/recuperar-senha',
        loadChildren: () => import('./trabalhador/Login/recuperar-senha/recuperar-senha.module').then(m => m.RecuperarSenhaPageModule)
    },
    {
        path: 'trabalhador/inicial',
        loadChildren: () => import('./trabalhador/Logado/inicial/inicial.module').then(m => m.InicialPageModule)
    },
   /*  {
        path: 'perfil',
        loadChildren: () => import('./trabalhador/Logado/Perfil-trabalhador/perfil/perfil.module').then(m => m.PerfilPageModule)
    }, */
    {
        path: 'trabalhador/privacidade',
        loadChildren: () => import('./trabalhador/Logado/Perfil-trabalhador/privacidade/privacidade.module').then(m => m.PrivacidadePageModule)
    },
    {
        path: 'ultimos-pedidos',
        loadChildren: () => import('./trabalhador/Logado/Perfil-trabalhador/ultimos-pedidos/ultimos-pedidos.module').then(m => m.UltimosPedidosPageModule)
    },
    {
        path: 'trabalhador/perfil-cliente',
        loadChildren: () => import('./trabalhador/Logado/perfil-cliente/perfil-cliente.module').then(m => m.PerfilClientePageModule)
    },
    {
        path: 'analisa-servico',
        loadChildren: () => import('./trabalhador/Logado/Servico/analisa-servico/analisa-servico.module').then(m => m.AnalisaServicoPageModule)
    },
    {
        path: 'trabalhador/avaliacao',
        loadChildren: () => import('./trabalhador/Logado/Servico/avaliacao/avaliacao.module').then(m => m.AvaliacaoPageModule)
    },
    {
        path: 'trabalhador/trabalhador-caminho',
        loadChildren: () => import('./trabalhador/Logado/Servico/trabalhador-caminho/trabalhador-caminho.module').then(m => m.TrabalhadorCaminhoPageModule)
    },
    {
        path: 'comercial',
        loadChildren: () => import('./trabalhador/Logado/comercial/comercial.module').then(m => m.ComercialPageModule)
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }