using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

[RoutePrefix("Endereco")]
public class EnderecoController : Controller
{
    [HttpPost]
    [Route("AdicionarEndereco")]
    public void AdicionarEndereco()
    {
        Banco banco = new Banco();
        banco.Conectar();

        Endereco endereco = JsonConvert.DeserializeObject<Endereco>(Request["endereco"]);

        #region Adiciona o endereço no banco

        string comando = $@"INSERT INTO endereco VALUES 
        (
	        (SELECT IFNULL(MAX(cd_endereco) + 1, 1) FROM (SELECT cd_endereco FROM endereco) AS temp),
	        '{endereco.Cep}',
	        '{endereco.Identificacao}',
	        '{endereco.CpfCliente}',
	        {endereco.Numero},
	        '{endereco.Complemento}',
	        '{endereco.Referencia}'
        );";
        banco.Executar(comando);

        banco.Desconectar();

        #endregion 
    }

    [HttpGet]
    [Route("CarregarEndereco")]
    public string CarregarEndereco()
    {
        Banco banco = new Banco();
        banco.Conectar();

        string cpf = Request["cpf"];

        string comando = $"SELECT * FROM endereco WHERE cd_cpf_cliente = '{cpf}'";
        MySqlDataReader dados = banco.Consultar(comando);

        Endereco endereco = new Endereco();

        if (dados != null && dados.Read())
        {
            endereco.Codigo = dados.GetInt32(0);
            endereco.Cep = dados.GetString(1);
            endereco.Identificacao = dados.GetString(2);
            endereco.Numero = dados.GetInt32(4);
            endereco.Complemento = dados.GetString(5);
            endereco.Referencia = dados.GetString(6);
        }

        dados.Close();
        banco.Desconectar();

        return JsonConvert.SerializeObject(endereco);
    }
}
