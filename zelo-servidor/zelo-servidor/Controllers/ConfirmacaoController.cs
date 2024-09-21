﻿using System;
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
        EnviarEmail(confirmacao);

        string json = "{'res': 'ok', 'codigo': '" + confirmacao.CodigoConfirmacao + "'}";
        json = json.Replace("'", "\"");

        return json;

        #endregion
    }

    public void EnviarEmail(Confirmacao confirmacao)
    {
        Banco banco = new Banco();
        banco.Conectar();

        #region Pega o email do cliente no banco

        string comando = $"SELECT nm_email_cliente FROM cliente WHERE cd_cpf_cliente = '{confirmacao.CpfCliente}';";

        if (confirmacao.CpfCliente == "" || confirmacao.CpfCliente == null)
        {
            comando = $"SELECT nm_email_trabalhador FROM trabalhador WHERE cd_cpf_trabalhador = '{confirmacao.CpfTrabalhador}';";
        }

        MySqlDataReader dados = banco.Consultar(comando);
        string emailUsuario = "";

        if (dados != null && dados.Read())
        {
            emailUsuario = dados.GetString(0);
        }

        dados.Close();

        #endregion

        #region Cria e envia o email

        SmtpClient cliente = new SmtpClient();
        cliente.Host = "smtp.gmail.com";
        cliente.Port = 587;
        cliente.EnableSsl = true;
        cliente.Credentials = new NetworkCredential("zelo.ccontato@gmail.com", "cuba vbdx lqag qtmn");

        MailMessage email = new MailMessage();
        email.To.Add(emailUsuario);
        email.From = new MailAddress("zelo.ccontato@gmail.com", "Zelo", System.Text.Encoding.UTF8);

        email.Subject = "Confirmação de email";
        email.SubjectEncoding = System.Text.Encoding.UTF8;

        email.Body = $@"
        <img style='margin-bottom: 20px; width: 200px;'' src='https://joaosena0206.github.io/zelo_imagens/imgs/Logo_preta.png'>
        <p style='color: black'>Olá, digite o código abaixo no app para confirmar seu email</p>
        <p style='font-weight: bold; font-size: 30px'>{confirmacao.CodigoConfirmacao}</p>";
        email.BodyEncoding = System.Text.Encoding.UTF8;
        email.IsBodyHtml = true;

        email.Priority = MailPriority.High;

        cliente.Send(email);

        #endregion
    }
}