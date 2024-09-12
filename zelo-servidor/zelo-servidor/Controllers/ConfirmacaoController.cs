using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
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

        #region Pega o maior código disponível da confirmação

        comando = "SELECT IFNULL(MAX(cd_confirmacao) + 1, 1) FROM confirmacao";
        dados = banco.Consultar(comando);

        Confirmacao confirmacao = new Confirmacao();
        confirmacao.CodigoConfirmacao = codigo;

        if (dados != null && dados.Read())
        {
            confirmacao.Codigo = dados.GetInt32(0);
        }

        dados.Close();

        #endregion

        if (tipo == "cliente")
        {
            comando = $@"INSERT INTO confirmacao VALUES
            (
	            {confirmacao.Codigo},
	            '{cpf}',
	            NULL,
	            '{codigo}'
            )";

            confirmacao.CpfCliente = cpf;
        }
        else
        {
            comando = $@"INSERT INTO confirmacao VALUES
            (
	            {confirmacao.Codigo},
	            NULL,
	            '{cpf}',
	            '{codigo}'
            )";

            confirmacao.CpfTrabalhador = cpf;
        }

        banco.Executar(comando);

        return "ok";

        #endregion
    }

    public void EnviarEmail(Confirmacao confirmacao)
    {
        Banco banco = new Banco();
        banco.Conectar();

        SmtpClient cliente = new SmtpClient();
        cliente.Host = "smtp-mail.outlook.com";
        cliente.Port = 587;
        cliente.EnableSsl = true;
        cliente.Credentials = new NetworkCredential("zelocontato@hotmail.com", "zelo1234");
    }
}