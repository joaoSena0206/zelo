using FirebaseAdmin.Messaging;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
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

        string comando = $"Insert into trabalhador values('{trabalhador.Cpf}', '{trabalhador.Nome}', '{trabalhador.DataNascimento.ToString("yyyy-MM-dd")}', '{trabalhador.DataCadastro.ToString("yyyy-MM-dd")}','{trabalhador.Email}', md5('{trabalhador.Senha}'), null, false, false, 0, null, null, '')";
        banco.Executar(comando);

        banco.Desconectar();

        return "ok";

        #endregion
    }


    [HttpPost]
    [Route("AdicionarFotoPerfil")]
    public async Task AdicionarFotoPerfil(string cpf, HttpPostedFileBase file)
    {
        string caminhoPasta = Server.MapPath("~/Imgs/Perfil/Trabalhador/");

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

        string cpf = Request["cpf"];

        #region Verifica Situação do trabalhador

        bool situacao = false;

        string comando = $"select ic_disponivel_trabalhador from trabalhador where cd_cpf_trabalhador = '{cpf}'";
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

        string cpf = Request["cpf"];
        string codigoResultado = Request["Resultado"].ToString();

        string comando = $@"UPDATE trabalhador SET ic_disponivel_trabalhador = {codigoResultado} WHERE cd_cpf_trabalhador = '{cpf}'";
        banco.Executar(comando);

        #endregion
    }

    [HttpPost]
    [Route("AdicionarCertificado")]
    public void AdicionarCertificado()
    {
        string cpf = Request["cpf"];

        #region Cria uma pasta com o cpf do trabalhador

        string caminhoPasta = Server.MapPath(Path.Combine("~/Imgs/Certificados", cpf));

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
                string caminho = Path.Combine(Server.MapPath("~/Imgs/Certificados/" + cpf), i + Path.GetExtension(file.FileName));

                file.SaveAs(caminho);
            }
        }

        #endregion
    }

    [HttpPost]
    [Route("AdicionarSaque")]
    public void AdicionarSaque()
    {
        Banco banco = new Banco();
        banco.Conectar();

        string cpf = Request["cpf"];
        string pix = Request["pix"];
        string valorVisita = Request["valor"];

        string comando = $@"UPDATE trabalhador SET nm_pix_trabalhador = '{pix}', vl_visita_trabalhador = {valorVisita}
        WHERE cd_cpf_trabalhador = '{cpf}'";
        banco.Executar(comando);

        banco.Desconectar();
    }

    [HttpPost]
    [Route("AdicionarCategoria")]
    public void AdicionarCategoria()
    {
        Banco banco = new Banco();
        banco.Conectar();

        string cpf = Request["cpf"];
        List<Servico> listaServico = JsonConvert.DeserializeObject<List<Servico>>(Request["categorias"]);

        for (int i = 0; i < listaServico.Count; i++)
        {
            string comando = $@"INSERT INTO servico_trabalhador VALUES
            (
	            '{cpf}',
	            {listaServico[i].Codigo}
            );";

            banco.Executar(comando);
        }

        banco.Desconectar();
    }

    public decimal PegarEstrelas(string cpf)
    {
        Banco banco = new Banco();
        banco.Conectar();

        #region Pega a média de avaliação do trabalhador no banco

        string comando = $@"SELECT IFNULL(AVG(qt_estrelas_avaliacao_servico), 5) FROM solicitacao_servico
        WHERE cd_cpf_trabalhador = '{cpf}'";
        MySqlDataReader dados = banco.Consultar(comando);

        decimal estrelas = 0;

        if (dados != null && dados.Read())
        {
            estrelas = dados.GetDecimal(0);
        }

        dados.Close();
        banco.Desconectar();

        return estrelas;

        #endregion
    }

    [HttpGet]
    [Route("CarregarTrabalhadores")]
    public string CarregarTrabalhadores()
    {
        Banco banco = new Banco();
        banco.Conectar();

        int codigo = int.Parse(Request["c"]);

        #region Pega os trabalhadores no banco de acordo com o serviço

        string comando = $@"
            SELECT t.cd_cpf_trabalhador,
                nm_trabalhador,
                nm_servico,
                vl_visita_trabalhador,
                cd_latitude_atual_trabalhador,
                cd_longitude_atual_trabalhador,
                nm_token_fcm
            FROM trabalhador t
                JOIN servico_trabalhador st ON (t.cd_cpf_trabalhador = st.cd_cpf_trabalhador)
                JOIN servico s ON (st.cd_servico = s.cd_servico)
            WHERE st.cd_servico = {codigo} AND ic_disponivel_trabalhador = true";
        MySqlDataReader dados = banco.Consultar(comando);

        List<ServicoTrabalhador> listaServicoTrabalhador = new List<ServicoTrabalhador>();

        if (dados != null)
        {
            while (dados.Read())
            {
                ServicoTrabalhador servicoTrabalhador = new ServicoTrabalhador();
                Trabalhador trabalhador = new Trabalhador();
                Servico servico = new Servico();

                trabalhador.Cpf = dados.GetString(0);
                trabalhador.Nome = dados.GetString(1);
                trabalhador.ValorVisita = dados.GetDecimal(3);
                trabalhador.Avaliacao = PegarEstrelas(trabalhador.Cpf);
                trabalhador.LatitudeAtual = dados.GetDecimal(4);
                trabalhador.LongitudeAtual = dados.GetDecimal(5);
                trabalhador.TokenFCM = dados.GetString(6);

                servico.Nome = dados.GetString(2);

                servicoTrabalhador.Trabalhador = trabalhador;
                servicoTrabalhador.Servico = servico;

                listaServicoTrabalhador.Add(servicoTrabalhador);
            }
        }

        dados.Close();
        banco.Desconectar();

        return JsonConvert.SerializeObject(listaServicoTrabalhador, Formatting.Indented);

        #endregion
    }

    [HttpPost]
    [Route("AtualizarLoc")]
    public void AtualizarLoc(string cpf, string lat, string log)
    {
        Banco banco = new Banco();
        banco.Conectar();

        string comando = $@"UPDATE trabalhador SET cd_latitude_atual_trabalhador = {lat}, cd_longitude_atual_trabalhador = {log}
        WHERE cd_cpf_trabalhador = '{cpf}'";
        banco.Executar(comando);
        banco.Desconectar();
    }

    [HttpPost]
    [Route("EnviarServicoAceito")]
    public async Task<int> EnviarSolicitacao()
    {
        string token = Request["token"];
        string situacaoServico = Request["situacao"];
        Trabalhador trababalhador = JsonConvert.DeserializeObject<Trabalhador>(Request["trabalhador"]);

        string solicitacao = Request["solicitacao"];

        var msg = new Message()
        {
            Notification = new Notification()
            {
                Title = "Situação do serviço",
                Body = $"Enviada por {trababalhador.Nome}"
            },
            Data = new Dictionary<string, string>()
            {
                {"situacaoServico", situacaoServico}
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

        string comando = $@"UPDATE trabalhador SET nm_token_fcm = '{token}'
        WHERE cd_cpf_trabalhador = '{cpf}'";
        banco.Executar(comando);
        banco.Desconectar();
    }
}
