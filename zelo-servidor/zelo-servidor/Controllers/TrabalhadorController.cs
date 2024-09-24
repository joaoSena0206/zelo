using MySql.Data.MySqlClient;
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

        #region Adiciona o trabalhador no banco

        Trabalhador trabalhador = JsonConvert.DeserializeObject<Trabalhador>(Request["trabalhador"]);

        string comando = $"Insert into trabalhador values('{trabalhador.Cpf}', '{trabalhador.Nome}', '{trabalhador.DataNascimento.ToString("yyyy-MM-dd")}', '{trabalhador.DataCadastro.ToString("yyyy-MM-dd")}','{trabalhador.Email}', md5('{trabalhador.Senha}'), null, false, false)";
        banco.Executar(comando);

        banco.Desconectar();

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
            trabalhador.DataNascimento = dados.GetDateTime(2);
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

    [HttpPost]
    [Route("AdicionarCertificado")]
    public void AdicionarCertificado()
    {
        string cpf = Request["cpf"];

        #region Cria uma pasta com o cpf do trabalhador

        string caminhoPasta = Server.MapPath("~/Certificados/" + cpf);

        if (!Directory.Exists(caminhoPasta))
        {
            Directory.CreateDirectory(caminhoPasta);
        }

        #endregion

        #region Lê o arquivo e grava na pasta do trabalhador

        for (int i = 0; i < Request.Files.Count; i++)
        {
            HttpPostedFileBase file = Request.Files[i];

            if (file != null && file.ContentLength > 0)
            {
                string caminho = Path.Combine(Server.MapPath("~/Certificados/" + cpf), Path.GetFileName(file.FileName));

                file.SaveAs(caminho);
            }
        }

        #endregion
    }
}
