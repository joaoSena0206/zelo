using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MySql.Data;
using MySql.Data.MySqlClient;

[RoutePrefix("Confirmacao")]
public class ConfirmacaoController : Controller
{
    [HttpPost]
    [Route("GerarCodigo")]
    public string GerarCodigo()
    {
        Banco banco = new Banco();
        banco.Conectar();

        string cpf = Request["cpf"];
        string tipo = Request["tipo"];

        #region Gera o código aleatório e insere no banco

        Random random = new Random();
        string codigo = random.Next(10000, 99999).ToString();

        #region Checa a existência de um código aleatório já criado na tabela

        string comando = $"SELECT COUNT(cd_cpf_{tipo}) FROM confirmacao WHERE cd_cpf_{tipo} = '{cpf}'";
        MySqlDataReader dados = banco.Consultar(comando);

        bool existe = false;

        if (dados != null && dados.Read())
        {
            existe = dados.GetBoolean(0);
        }

        dados.Close();

        if (existe == true)
        {
            comando = $"DELETE FROM confirmacao WHERE cd_cpf_{tipo} = '{cpf}'";
            banco.Executar(comando);
        }

        #endregion

        if (tipo == "cliente")
        {
            comando = $@"INSERT INTO confirmacao VALUES
            (
	            (SELECT IFNULL(MAX(cd_confirmacao) + 1, 1) FROM (SELECT cd_confirmacao FROM confirmacao) AS temp),
	            '{cpf}',
	            NULL,
	            '{codigo}'
            )";
        }
        else
        {
            comando = $@"INSERT INTO confirmacao VALUES
            (
	            (SELECT IFNULL(MAX(cd_confirmacao) + 1, 1) FROM (SELECT cd_confirmacao FROM confirmacao) AS temp),
	            NULL,
	            '{cpf}',
	            '{codigo}'
            )";
        }

        banco.Executar(comando);

        return "ok";

        #endregion
    }
}