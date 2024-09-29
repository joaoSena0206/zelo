using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

[RoutePrefix("Patrocinio")]
public class PatrocinioController : Controller
{
    [HttpGet]
    [Route("CarregarPatrocinados")]
    public string CarregarPatrocinados()
    {
        Banco banco = new Banco();
        banco.Conectar();

        #region Carrega os patrocinados do banco

        string comando = @"SELECT p.cd_cpf_trabalhador, nm_trabalhador, dt_cadastro_trabalhador, nm_servico, p.cd_servico FROM patrocinio p
        JOIN trabalhador t ON (p.cd_cpf_trabalhador = t.cd_cpf_trabalhador)
        JOIN servico s ON (p.cd_servico = s.cd_servico)
        GROUP BY p.cd_cpf_trabalhador";
        MySqlDataReader dados = banco.Consultar(comando);

        List<Patrocinio> listaPatrocinio = new List<Patrocinio>();
        TrabalhadorController trabalhadorController = new TrabalhadorController();

        if (dados != null)
        {
            while (dados.Read())
            {
                Patrocinio patrocinio = new Patrocinio();
                Trabalhador trabalhador = new Trabalhador();
                Servico servico = new Servico();

                trabalhador.Cpf = dados.GetString(0);
                trabalhador.Nome = dados.GetString(1);
                trabalhador.DataCadastro = dados.GetDateTime(2);
                trabalhador.Avaliacao = trabalhadorController.PegarEstrelas(trabalhador.Cpf);

                servico.Codigo = dados.GetInt32(4);
                servico.Nome = dados.GetString(3);

                patrocinio.Trabalhador = trabalhador;
                patrocinio.Servico = servico;

                listaPatrocinio.Add(patrocinio);
            }
        }

        dados.Close();
        banco.Desconectar();

        return JsonConvert.SerializeObject(listaPatrocinio, Formatting.Indented);

        #endregion
    }
}
