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
using FirebaseAdmin.Messaging;
using System.Text;

[RoutePrefix("Cliente")]
public class ClienteController : Controller
{
    [HttpPost]
    [Route("Adicionar")]
    public string Adicionar()
    {
        Banco banco = new Banco();
        banco.Conectar();

        #region Adiciona o cliente no banco

        Cliente cliente = JsonConvert.DeserializeObject<Cliente>(Request["cliente"]);

        string comando = $"Insert into cliente values('{cliente.Cpf}', '{cliente.Nome}', '{cliente.DataNascimento.ToString("yyyy-MM-dd")}','{cliente.Email}', md5('{cliente.Senha}'), false, '')";
        banco.Executar(comando);

        banco.Desconectar();

        return "ok";

        #endregion
    }

    [HttpPost]
    [Route("AdicionarFotoPerfil")]
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
            string avatar = "https://joaosena0206.github.io/zelo_imagens/imgs/avatar.jpg";
            string caminhoArquivo = Path.Combine(caminhoPasta, cpf + ".jpg");

            using (HttpClient client = new HttpClient())
            {
                byte[] avatarBytes = await client.GetByteArrayAsync(avatar);

                System.IO.File.WriteAllBytes(caminhoArquivo, avatarBytes);
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

        #region Checa a exist�ncia do email e do cpf

        string cpf = Request["cpf"];
        string email = Request["email"];
        string json = "{'cadastrado': [ ";

        string comando = $"SELECT COUNT(cd_cpf_cliente) FROM cliente WHERE cd_cpf_cliente = '{cpf}'";
        MySqlDataReader dados = banco.Consultar(comando);

        if (dados != null)
        {
            if (dados.Read())
            {
                if (dados.GetBoolean(0) == true)
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
                if (dados.GetBoolean(0))
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

    [HttpPost]
    [Route("EnviarSolicitacao")]
    public async Task<int> EnviarSolicitacao()
    {
        string token = Request["token"];
        string endereco = Request["endereco"];
        Cliente cliente = JsonConvert.DeserializeObject<Cliente>(Request["cliente"]);
        string solicitacao = Request["solicitacao"];

        var msg = new Message()
        {
            Notification = new Notification()
            {
                Title = "Solicita��o de servi�o",
                Body = $"Enviada por {cliente.Nome}"
            },
            Data = new Dictionary<string, string>()
            {
                {"cliente", JsonConvert.SerializeObject(cliente)},
                {"endereco", endereco},
                {"solicitacao", solicitacao}
            },
            Token = token
        };

        string resposta = await FirebaseMessaging.DefaultInstance.SendAsync(msg);

        return 0;
    }

    [HttpPost]
    [Route("AdicionarTokenFCM")]
    public void AdicionarTokenFCM(string cpf, string token)
    {
        Banco banco = new Banco();
        banco.Conectar();

        string comando = $@"UPDATE cliente SET nm_token_fcm = '{token}'
        WHERE cd_cpf_cliente = '{cpf}'";
        banco.Executar(comando);
        banco.Desconectar();
    }

    [HttpPost]
    [Route("GerarPagamento")]
    public async Task<string> GerarPagamento()
    {
        decimal valorVisita = decimal.Parse(Request["valor"]);
        string email = Request["email"];
        string cpf = Request["cpf"];
        int cdSolicitacao = int.Parse(Request["c"]);
        string expiracao = Request["expiracao"];

        string json = @"{'transaction_amount': " + valorVisita + ", 'date_of_expiration': '" + expiracao + "','payment_method_id': 'pix', 'payer': {'email': '" + email + "', 'identification': {'type': 'CPF', 'number': '" + cpf + "'}}}";
        json = json.Replace("'", "\"");

        using (var client = new HttpClient())
        {
            client.BaseAddress = new Uri("https://api.mercadopago.com");
            client.DefaultRequestHeaders.Add("accept", "application/json");
            client.DefaultRequestHeaders.Add("Authorization", "Bearer TEST-3082013782228827-100609-813b0e848cd83a53e8ab00c777834bd7-2021112151");
            client.DefaultRequestHeaders.Add("X-Idempotency-Key", cdSolicitacao.ToString());

            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var result = await client.PostAsync("/v1/payments", content);
            var res = await result.Content.ReadAsStringAsync();

            return res;
        }
    }

    [HttpPost]
    [Route("ReceberPagamento")]
    public string ReceberPagamento()
    {
        string json;
        using (Stream receiveStream = Request.InputStream)
        {
            using (StreamReader reader = new StreamReader(receiveStream, Encoding.UTF8))
            {
                json = reader.ReadToEnd();
            }
        }

        return json;
    }

    [HttpPost]
    [Route("PegarTokenFCM")]
    public string PegarTokenFCM()
    {
        string cpf = Request["cpf"];

        Banco banco = new Banco();
        banco.Conectar();

        string comando = $@"select nm_token_fcm from cliente where cd_cpf_cliente = {cpf};";
        MySqlDataReader dados = banco.Consultar(comando);

        Cliente cliente = new Cliente();

        if (dados != null && dados.Read())
        {
            cliente.TokenFCM = dados.GetString(0);
        }

        return cliente.TokenFCM;
    }

}
