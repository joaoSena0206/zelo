using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;

[RoutePrefix("SolicitacaoServico")]
public class SolicitacaoServicoController : Controller
{
    [HttpGet]
    [Route("CarregarUltimosPedidos")]
    public string carregarUltimosPedidos()
    {
        Banco banco = new Banco();
        banco.Conectar();

        string tipo = Request["t"];
        string cpf = Request["c"];

        string comando = $@"SELECT nm_trabalhador, nm_servico, dt_solicitacao_servico, vl_visita_trabalhador, ss.cd_cpf_trabalhador, ss.cd_servico FROM solicitacao_servico ss
        JOIN trabalhador t ON (ss.cd_cpf_trabalhador = t.cd_cpf_trabalhador)
        JOIN servico s ON (ss.cd_servico = s.cd_servico)
        WHERE ss.cd_cpf_trabalhador = '{cpf}'";

        if (tipo == "trabalhador")
        {
            comando = $"select SS.ds_servico, C.nm_cliente, SS.cd_solicitacao_servico from solicitacao_servico SS join cliente C on(SS.cd_cpf_cliente = C.cd_cpf_cliente) where cd_cpf_trabalhador = {cpf} ORDER BY dt_solicitacao_servico DESC LIMIT 5";
        }

        MySqlDataReader dados = banco.Consultar(comando);

        List<SolicitacaoServico> listaHistorico = new List<SolicitacaoServico>();
        TrabalhadorController trabalhadorController = new TrabalhadorController();

        if (dados != null)
        {
            while (dados.Read())
            {
                if (tipo == "cliente")
                {
                    SolicitacaoServico solicitacaoServico = new SolicitacaoServico();
                    Trabalhador trabalhador = new Trabalhador();
                    Servico servico = new Servico();

                    trabalhador.Cpf = dados.GetString(4);
                    trabalhador.Nome = dados.GetString(0);
                    trabalhador.ValorVisita = dados.GetDecimal(3);
                    trabalhador.Avaliacao = trabalhadorController.PegarEstrelas(trabalhador.Cpf);

                    servico.Codigo = dados.GetInt32(5);
                    servico.Nome = dados.GetString(1);

                    solicitacaoServico.Trabalhador = trabalhador;
                    solicitacaoServico.Servico = servico;
                    solicitacaoServico.DtSolicitacaoServico = dados.GetDateTime(2);

                    listaHistorico.Add(solicitacaoServico);
                }
                else
                {
                    Cliente cliente = new Cliente();
                    SolicitacaoServico solicitacaoServico = new SolicitacaoServico();

                    cliente.Nome = dados.GetString(1);

                    solicitacaoServico.DsServico = dados.GetString(0);
                    solicitacaoServico.CdSolicitacaoServico = dados.GetInt32(2);
                    solicitacaoServico.Cliente = cliente;

                    listaHistorico.Add(solicitacaoServico);
                }
            }
        }

        if (!dados.IsClosed)
        {
            dados.Close();
        }
        
        banco.Desconectar();

        return JsonConvert.SerializeObject(listaHistorico, Formatting.Indented);
    }

    [HttpGet]
    [Route("carregarcomentariosAnonimos")]
    public string carregarcomentariosAnonimos()
    {
        Banco banco = new Banco();
        banco.Conectar();

        string tipo = Request["t"];
        string cpf = Request["c"];

        string comando = "";

        if (tipo == "trabalhador")
        {
            comando = $"select ds_comentario_avaliacao_servico, qt_estrelas_avaliacao_servico from solicitacao_servico where cd_cpf_trabalhador = {cpf} ORDER BY RAND() LIMIT 5";
        }

        MySqlDataReader dados = banco.Consultar(comando);

        List<SolicitacaoServico> listaHistorico = new List<SolicitacaoServico>();
        TrabalhadorController trabalhadorController = new TrabalhadorController();

        if (dados != null)
        {
            while (dados.Read())
            {
                SolicitacaoServico solicitacaoServico = new SolicitacaoServico();

                solicitacaoServico.DsComentarioAvaliacaoServico = dados.GetString(0);
                solicitacaoServico.QtEstrelasAvaliacaoServico = dados.GetInt32(1);

                listaHistorico.Add(solicitacaoServico);
                
            }
        }

        if (!dados.IsClosed)
        {
            dados.Close();
        }

        banco.Desconectar();

        return JsonConvert.SerializeObject(listaHistorico, Formatting.Indented);
    }
}
