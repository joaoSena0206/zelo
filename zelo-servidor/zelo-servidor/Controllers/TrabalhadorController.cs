﻿using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;


[RoutePrefix("Trabalhador")]
public class TrabalhadorController : Controller
{
    [HttpPost]
    [Route("Adicionar")]
    public string Adicionar()
    {
        Banco banco = new Banco();
        banco.Conectar();

        #region Lê o conteúdo do body e converte o JSON em um objeto Trabalhador

        string json;
        using (var reader = new StreamReader(Request.InputStream))
        {
            json = reader.ReadToEnd();
        }

        Trabalhador trabalhador = JsonConvert.DeserializeObject<Trabalhador>(json);

        #endregion

        #region Checa a existência do email e do cpf

        string comando = $"SELECT COUNT(cd_cpf_trabalhador) FROM trabalhador WHERE cd_cpf_trabalhador = '{trabalhador.Cpf}'";
        MySqlDataReader dados = banco.Consultar(comando);

        bool cpfExiste = false;
        bool emailExiste = false;

        if (dados != null)
        {
            if (dados.Read())
            {
                if (dados.GetInt32(0) >= 1)
                {
                    cpfExiste = true;
                }
            }
        }

        dados.Close();

        comando = $"SELECT COUNT(nm_email_trabalhador) FROM trabalhador WHERE nm_email_trabalhador = '{trabalhador.Email}'";
        dados = banco.Consultar(comando);

        if (dados != null)
        {
            if (dados.Read())
            {
                if (dados.GetInt32(0) >= 1)
                {
                    emailExiste = true;
                }
            }
        }

        dados.Close();

        if (cpfExiste == true)
        {
            return "Cpf já cadastrado!";
        }

        if (emailExiste == true)
        {
            return "Email já cadastrado!";
        }

        #endregion

        #region Adiciona o cliente no banco

        comando = $"Insert into trabalhador values('{trabalhador.Cpf}', '{trabalhador.Nome}', '{trabalhador.DataNascimento}','{trabalhador.Email}', md5('{trabalhador.Senha}'), '{trabalhador.Pix}', false, false)";
        banco.Executar(comando);

        return "ok";

        #endregion

        return "foi";
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

        string comando = $"SELECT COUNT(cd_cpf_trabalhador) FROM trabalhador WHERE cd_cpf_trabalhador = '{cpf}'";
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

        comando = $"SELECT COUNT(nm_email_trabalhador) FROM trabalhador WHERE nm_email_trabalhador = '{email}'";
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

    [HttpPost]
    [Route("ConfirmarEmail")]
    public string ConfirmarEmail()
    {
        Banco banco = new Banco();
        banco.Conectar();

        #region Confirma o email no banco

        string cpf = Request["cpf"];

        string comando = $"UPDATE trabalhador SET ic_email_confirmado_trabalhador = true WHERE cd_cpf_trabalhador = '{cpf}'";
        banco.Executar(comando);

        banco.Desconectar();

        return "ok";

        #endregion
    }

    [HttpPost]
    [Route("Logar")]
    public string Logar()
    {
        Banco banco = new Banco();
        banco.Conectar();

        string email = Request["email"];
        string senha = Request["senha"];

        #region Pega os dados do trabalhador no banco, caso existam

        string comando = $@"SELECT cd_cpf_trabalhador, nm_trabalhador, dt_nascimento_trabalhador, ic_email_confirmado_trabalhador, nm_pix_trabalhador FROM trabalhador
        WHERE nm_email_trabalhador = '{email}' AND nm_senha_trabalhador = md5('{senha}');";
        MySqlDataReader dados = banco.Consultar(comando);

        Trabalhador trabalhador = new Trabalhador();

        if (dados != null && dados.Read())
        {
            trabalhador.Cpf = dados.GetString(0);
            trabalhador.Nome = dados.GetString(1);
            trabalhador.DataNascimento = dados.GetString(2);
            trabalhador.Email = email;
            trabalhador.Confirmado = dados.GetBoolean(3);
            trabalhador.Pix = dados.GetString(4);
        }

        if (String.IsNullOrEmpty(trabalhador.Cpf))
        {
            string json = "{'erro': true}";
            json = json.Replace("'", "\"");

            return json;
        }

        return JsonConvert.SerializeObject(trabalhador);

        #endregion
    }

    [HttpPost]
    [Route("VerificarSituacao")]
    public bool VerificarSituacao()
    {
        Banco banco = new Banco();
        banco.Conectar();

        #region Verifica Situação do trabalhador

        bool situacao = false;

        string comando = $"select ic_disponivel_trabalhador from trabalhador where cd_cpf_trabalhador = 535305697";
        MySqlDataReader dados = banco.Consultar(comando);

        if (dados != null)
        {
            if (dados.Read())
            {
                situacao = dados.GetBoolean(0);
            }
        }

        return situacao;

        #endregion

    }

    [HttpPost]
    [Route("AtualizarSituacao")]
    public void AtualizarSituacao()
    {
        Banco banco = new Banco();
        banco.Conectar();

        #region Atualizar banco

        string codigoResultado = Request["Resultado"].ToString();

        if (Request["Resultado"] == null)
        {

        }

        if (String.IsNullOrEmpty(Request["Resultado"]))
        {

        }

        string comando = $@"UPDATE trabalhador SET ic_disponivel_trabalhador = {codigoResultado} WHERE cd_cpf_trabalhador = '535305697'";
        banco.Executar(comando);

        #endregion
    }
}
