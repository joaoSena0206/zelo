using MySql.Data.MySqlClient;
using Newtonsoft.Json;
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
    public string CarregarServicos()
    {
        Banco banco = new Banco();
        banco.Conectar();

        #region Carrega os serviços do banco de acordo com a categoria

        string comando = $"SELECT * FROM servico";
        MySqlDataReader dados = banco.Consultar(comando);

        List<Servico> listaServico = new List<Servico>();

        if (dados != null)
        {
            while (dados.Read())
            {
                Servico servico = new Servico();
                servico.Codigo = dados.GetInt32(0);
                servico.CodigoCategoria = dados.GetInt32(1);
                servico.Nome = dados.GetString(2);

                listaServico.Add(servico);
            }
        }

        dados.Close();
        banco.Desconectar();

        return JsonConvert.SerializeObject(listaServico, Formatting.Indented);

        #endregion
    }

    [HttpGet]
    [Route("CarregarServico")]
    public string CarregarServico()
    {
        Banco banco = new Banco();
        banco.Conectar();

        int codigo = int.Parse(Request["c"]);

        return "a";
    }
}
