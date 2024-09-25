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
using System.Net.Http;
using System.Threading.Tasks;

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

        string comando = $"Insert into cliente values('{cliente.Cpf}', '{cliente.Nome}', '{cliente.DataNascimento.ToString("yyyy-MM-dd")}','{cliente.Email}', md5('{cliente.Senha}'), false)";
        banco.Executar(comando);

        EnderecoController enderecoController = new EnderecoController();
        enderecoController.AdicionarEndereco(endereco);

        banco.Desconectar();

        AdicionarFotoPerfil(cliente.Cpf, null);

        return "ok";

        #endregion
    }

    public async Task AdicionarFotoPerfil(string cpf, HttpPostedFileBase file)
    {
        string caminhoPasta = Server.MapPath("~/Imgs/Perfil/Cliente/");

        #region Grava a foto de perfil, e caso nula, pega o svg da web e grava no lugar

        if (file != null && file.ContentLength > 0)
        {
            string caminho = Path.Combine(caminhoPasta, Path.GetFileName(file.FileName));

            file.SaveAs(caminho);
        }
        else
        {
            string svg = "https://ionicframework.com/docs/img/demos/avatar.svg";
            string caminhoArquivo = Path.Combine(caminhoPasta, cpf + ".svg");

            using (HttpClient client = new HttpClient())
            {
                string conteudoSvg = await client.GetStringAsync(svg);

                System.IO.File.WriteAllText(caminhoArquivo, conteudoSvg);
            }
        }

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

    [HttpPost]
    [Route("ConfirmarEmail")]
    public string ConfirmarEmail()
    {
        Banco banco = new Banco();
        banco.Conectar();

        #region Confirma o email no banco

        string cpf = Request["cpf"];

        string comando = $"UPDATE cliente SET ic_email_confirmado_cliente = true WHERE cd_cpf_cliente = '{cpf}'";
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

        #region Pega os dados do cliente no banco, caso existam

        string comando = $@"SELECT cd_cpf_cliente, nm_cliente, dt_nascimento_cliente, ic_email_confirmado_cliente FROM cliente
        WHERE nm_email_cliente = '{email}' AND nm_senha_cliente = md5('{senha}');";
        MySqlDataReader dados = banco.Consultar(comando);

        Cliente cliente = new Cliente();

        if (dados != null && dados.Read())
        {
            cliente.Cpf = dados.GetString(0);
            cliente.Nome = dados.GetString(1);
            cliente.DataNascimento = dados.GetDateTime(2);
            cliente.Email = email;
            cliente.Confirmado = dados.GetBoolean(3);
        }

        if (String.IsNullOrEmpty(cliente.Cpf))
        {
            string json = "{'erro': true}";
            json = json.Replace("'", "\"");

            return json;
        }

        return JsonConvert.SerializeObject(cliente);

        #endregion
    }
}