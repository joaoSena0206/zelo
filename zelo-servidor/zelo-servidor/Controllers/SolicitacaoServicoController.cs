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

        string tipo = Request["tipo"];
        string cpf = Request["cpf"];

        string comando = $@"SELECT nm_trabalhador, nm_servico, dt_solicitacao_servico, vl_visita_trabalhador FROM solicitacao_servico ss
        JOIN trabalhador t ON (ss.cd_cpf_trabalhador = t.cd_cpf_trabalhador)
        JOIN servico_trabalhador st ON (t.cd_cpf_trabalhador = st.cd_cpf_trabalhador)
        JOIN servico s ON (st.cd_servico = s.cd_servico)
        WHERE ss.cd_cpf_trabalhador = '{cpf}'";

        if (tipo == "trabalhador")
        {
            comando = $"select SS.ds_servico, C.nm_cliente from solicitacao_servico SS join cliente C on(SS.cd_cpf_cliente = C.cd_cpf_cliente) where cd_cpf_trabalhador = '{cpf}'";
        }

        MySqlDataReader dados = banco.Consultar(comando);

        List<SolicitacaoServico> listaHistorico = new List<SolicitacaoServico>();

        if (dados != null)
        {
            while (dados.Read())
            {
                if (tipo == "cliente")
                {
                    SolicitacaoServico solicitacaoServico = new SolicitacaoServico();
                    Trabalhador trabalhador = new Trabalhador();

                    trabalhador.Nome = dados.GetString(0);
                    trabalhador.ValorVisita = dados.GetDecimal(3);

                    solicitacaoServico.Trabalhador = trabalhador;
                    solicitacaoServico.Servico = dados.GetString(1);
                    solicitacaoServico.DtSolicitacaoServico = dados.GetDateTime(2);

                    listaHistorico.Add(solicitacaoServico);
                }
                else
                {
                    Cliente cliente = new Cliente();
                    SolicitacaoServico solicitacaoServico = new SolicitacaoServico();

                    cliente.Nome = dados.GetString(1);

                    solicitacaoServico.DsServico = dados.GetString(0);
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
}
