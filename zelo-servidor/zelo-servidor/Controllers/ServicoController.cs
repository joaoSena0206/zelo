using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

[RoutePrefix("Servico")]
public class ServicoController : Controller
{
    [HttpGet]
    [Route("CarregarServicos")]
    public List<Servico> CarregarServicos()
    {
        Banco banco = new Banco();
        banco.Conectar();

        int codigoCategoria = Int32.Parse(Request["codigoCategoria"]);

        #region Carrega os serviços do banco de acordo com a categoria

        string comando = $"SELECT cd_servico, nm_servico FROM servico WHERE cd_categoria_servico = {codigoCategoria}";
        MySqlDataReader dados = banco.Consultar(comando);

        List<Servico> listaServico = new List<Servico>();

        if (dados != null)
        {
            while (dados.Read())
            {
                Servico servico = new Servico();
                servico.Codigo = dados.GetInt32(0);
                servico.CodigoCategoria = codigoCategoria;
                servico.Nome = dados.GetString(1);

                listaServico.Add(servico);
            }
        }

        dados.Close();
        banco.Desconectar();

        return listaServico;

        #endregion
    }
}