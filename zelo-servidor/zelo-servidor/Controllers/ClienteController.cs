using MySql.Data.MySqlClient;
using MySqlX.XDevAPI;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;

[RoutePrefix("Cliente")]
public class ClienteController : Controller
{
    [HttpPost]
    [Route("Adicionar")]
    public string Adicionar()
    {
        Banco banco = new Banco();
        banco.Conectar();

        #region Adiciona o cliente e o endereço no banco

        Cliente cliente = JsonConvert.DeserializeObject<Cliente>(Request["cliente"]);

        string enderecoJson = Request["endereco"].Replace("-", "");
        Endereco endereco = JsonConvert.DeserializeObject<Endereco>(enderecoJson);

        string comando = $"Insert into cliente values('{cliente.Cpf}', '{cliente.Nome}', '{cliente.DataNascimento}','{cliente.Email}', md5('{cliente.Senha}'), false)";
        banco.Executar(comando);

        EnderecoController enderecoController = new EnderecoController();
        enderecoController.AdicionarEndereco(endereco);

        return "ok";

        #endregion
    }

    [HttpPost]
    [Route("ChecarExistencia")]
    public string ChecarExistencia()
    {
        Banco banco = new Banco();
        banco.Conectar();

        #region Checa a existência do email e do cpf

        string cpf = Request["cpf"];
        string email = Request["email"];
        string json = "{'cadastrado': [ ";

        string comando = $"SELECT COUNT(cd_cpf_cliente) FROM cliente WHERE cd_cpf_cliente = '{cpf}'";
        MySqlDataReader dados = banco.Consultar(comando);

        if (dados != null)
        {
            if (dados.Read())
            {
                if (dados.GetInt32(0) >= 1)
                {
                    json += "'cpf',";
                }
            }
        }

        dados.Close();

        comando = $"SELECT COUNT(nm_email_cliente) FROM cliente WHERE nm_email_cliente = '{email}'";
        dados = banco.Consultar(comando);

        if (dados != null)
        {
            if (dados.Read())
            {
                if (dados.GetInt32(0) >= 1)
                {
                    json += "'email',";
                }
            }
        }

        dados.Close();
        banco.Desconectar();

        json = json.Substring(0, json.Length - 1) + "]}";
        json = json.Replace("'", "\"");

        return json;

        #endregion
    }
}