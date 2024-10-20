using FirebaseAdmin.Messaging;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc;


[ApiController]
[Route("Trabalhador")]
public class TrabalhadorController : ControllerBase
{
    [HttpPost("Adicionar")]
    public IActionResult Adicionar([FromForm] Trabalhador trabalhador)
    {
        Banco banco = new Banco();
        banco.Conectar();

        try
        {
            #region Adiciona o trabalhador no banco

            string comando = $"Insert into trabalhador values('{trabalhador.Cpf}', '{trabalhador.Nome}', '{trabalhador.DataNascimento.ToString("yyyy-MM-dd")}', '{trabalhador.DataCadastro.ToString("yyyy-MM-dd")}','{trabalhador.Email}', md5('{trabalhador.Senha}'), null, false, false, 0, null, null, '')";
            banco.Executar(comando);


            return Ok();

            #endregion
        }
        catch (Exception erro)
        {
            return BadRequest(erro.Message);
        }
        finally
        {
            banco.Desconectar();
        }
    }

    [HttpPost("AdicionarFotoPerfil")]
    public async Task<IActionResult> AdicionarFotoPerfil([FromForm] string cpf, [FromForm] IFormFile file)
    {
        try
        {
            string caminhoPasta = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/Imgs/Perfil/Trabalhador/");

            #region Grava a foto de perfil, e caso nula, pega o svg da web e grava no lugar

            if (file != null && file.Length > 0)
            {
                string caminho = Path.Combine(caminhoPasta, Path.GetFileName(file.FileName));

                using var stream = new FileStream(caminho, FileMode.Create);
                await file.CopyToAsync(stream);
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

            return Ok();

            #endregion
        }
        catch (Exception erro)
        {
            return BadRequest(erro.Message);
        } 
    }

    [HttpPost("ChecarExistencia")]
    public IActionResult ChecarExistencia([FromForm] string cpf, [FromForm] string email)
    {
        Banco banco = new Banco();
        banco.Conectar();

        try
        {
            #region Checa a existência do email e do cpf

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
            
            json = json.Substring(0, json.Length - 1) + "]}";
            json = json.Replace("'", "\"");

            return Ok(json);

            #endregion
        }
        catch (Exception erro)
        {
            return BadRequest(erro.Message);
        }
        finally
        {
            banco.Desconectar();
        }
    }

    [HttpPost("ConfirmarEmail")]
    public IActionResult ConfirmarEmail([FromForm] string cpf)
    {
        Banco banco = new Banco();
        banco.Conectar();

        try
        {
            #region Confirma o email no banco

            string comando = $"UPDATE trabalhador SET ic_email_confirmado_trabalhador = true WHERE cd_cpf_trabalhador = '{cpf}'";
            banco.Executar(comando);

            return Ok();

            #endregion
        }
        catch (Exception erro)
        {
            return BadRequest(erro.Message);
        }
        finally
        {
            banco.Desconectar();
        }
    }

    [HttpPost("Logar")]
    public IActionResult Logar([FromForm] string email, [FromForm] string senha)
    {
        Banco banco = new Banco();
        banco.Conectar();

        try
        {
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

                return Ok(json);
            }

            return Ok(trabalhador);

            #endregion
        }
        catch (Exception erro)
        {
            return BadRequest(erro.Message);
        } 
        finally
        {
            banco.Desconectar();
        }
    }

    [HttpPost("VerificarSituacao")]
    public IActionResult VerificarSituacao([FromForm] string cpf)
    {
        Banco banco = new Banco();
        banco.Conectar();

        try
        {
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

            return Ok(situacao);

            #endregion
        }
        catch (Exception erro)
        {
            return BadRequest(erro.Message);
        }
        finally
        {
            banco.Desconectar();
        }
    }

    [HttpPost("AtualizarSituacao")]
    public IActionResult AtualizarSituacao([FromForm] string cpf, [FromForm] string codigoResultado)
    {
        Banco banco = new Banco();
        banco.Conectar();

        try
        {
            #region Atualizar banco

            string comando = $@"UPDATE trabalhador SET ic_disponivel_trabalhador = {codigoResultado} WHERE cd_cpf_trabalhador = '{cpf}'";
            banco.Executar(comando);

            return Ok();

            #endregion
        }
        catch (Exception erro)
        {
            return BadRequest(erro.Message);
        }
        finally
        {
            banco.Desconectar();
        }  
    }

    [HttpPost("AdicionarCertificado")]
    public IActionResult AdicionarCertificado([FromForm] string cpf)
    {
        try
        {
            #region Cria uma pasta com o cpf do trabalhador

            string caminhoPasta = Path.Combine(Directory.GetCurrentDirectory(), "Imgs/Certificados", cpf);

            if (!Directory.Exists(caminhoPasta))
            {
                Directory.CreateDirectory(caminhoPasta);
            }

            #endregion

            #region Lê o arquivo e grava na pasta do trabalhador

            for (int i = 0; i < Request.Form.Files.Count; i++)
            {
                IFormFile file = Request.Form.Files[i];

                if (file != null && file.Length > 0)
                {
                    string caminho = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/Imgs/Certificados", cpf, i + Path.GetExtension(file.FileName));

                    using var stream = new FileStream(caminho, FileMode.Create);
                    file.CopyToAsync(stream);
                }
            }

            return Ok();

            #endregion
        }
        catch (Exception erro)
        {
            return BadRequest(erro.Message);
        } 
    }

    [HttpPost("AdicionarSaque")]
    public IActionResult AdicionarSaque([FromForm] string cpf, [FromForm] string pix, [FromForm] string valorVisita)
    {
        Banco banco = new Banco();
        banco.Conectar();


        try
        {
            string comando = $@"UPDATE trabalhador SET nm_pix_trabalhador = '{pix}', vl_visita_trabalhador = {valorVisita}
            WHERE cd_cpf_trabalhador = '{cpf}'";
            banco.Executar(comando);

            return Ok();
        }
        catch (Exception erro)
        {
            return BadRequest(erro.Message);
        }  
        finally
        {
            banco.Desconectar();
        }
    }

    [HttpPost("AdicionarCategoria")]
    public IActionResult AdicionarCategoria([FromForm] string cpf, [FromForm] List<Servico> listaServico)
    {
        Banco banco = new Banco();
        banco.Conectar();

        try
        {
            for (int i = 0; i < listaServico.Count; i++)
            {
                string comando = $@"INSERT INTO servico_trabalhador VALUES
                (
	                '{cpf}',
	                {listaServico[i].Codigo}
                );";

                banco.Executar(comando);
            }

            return Ok();
        }
        catch (Exception erro)
        {
            return BadRequest(erro.Message);
        }
        finally
        {
            banco.Desconectar();
        }
    }

    public decimal PegarEstrelas(string cpf)
    {
        Banco banco = new Banco();
        banco.Conectar();

        try
        {
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
            
            return estrelas;

            #endregion
        }
        catch (Exception erro)
        {
            throw new Exception(erro.Message);
        }
        finally
        {
            banco.Desconectar();
        }
    }

    [HttpGet("CarregarTrabalhadores")]
    public IActionResult CarregarTrabalhadores([FromQuery] int codigo)
    {
        Banco banco = new Banco();
        banco.Conectar();

        try
        {
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

            return Ok(listaServicoTrabalhador);

            #endregion
        }
        catch (Exception erro)
        {
            return BadRequest(erro.Message);
        }   
        finally
        {
            banco.Desconectar();
        }
    }

    [HttpPost("AtualizarLoc")]
    public IActionResult AtualizarLoc([FromForm] string cpf, [FromForm] string lat, [FromForm] string log)
    {
        Banco banco = new Banco();
        banco.Conectar();

        try
        {
            string comando = $@"UPDATE trabalhador SET cd_latitude_atual_trabalhador = {lat}, cd_longitude_atual_trabalhador = {log}
            WHERE cd_cpf_trabalhador = '{cpf}'";
            banco.Executar(comando);
            
            return Ok();
        }
        catch (Exception erro)
        {
            return BadRequest(erro.Message);
        }
        finally
        {
            banco.Desconectar();
        }
    }

    [HttpPost("EnviarServicoAceito")]
    public async Task<IActionResult> EnviarSolicitacao([FromForm] string token, [FromForm] string situacaoServico, [FromForm] Trabalhador trababalhador, [FromForm] string solicitacao)
    {
        try
        {
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

            return Ok();
        }
        catch (Exception erro)
        {
            return BadRequest(erro.Message);
        }
    }

    [HttpPost("AdicionarTokenFCM")]
    public IActionResult AdicionarTokenFCM([FromForm] string cpf, [FromForm] string token)
    {
        Banco banco = new Banco();
        banco.Conectar();

        try
        {
            string comando = $@"UPDATE trabalhador SET nm_token_fcm = '{token}'
            WHERE cd_cpf_trabalhador = '{cpf}'";
            banco.Executar(comando);
            
            return Ok();
        }
        catch (Exception erro)
        {
            return BadRequest(erro.Message);
        }
        finally
        {
            banco.Desconectar();
        }
    }
}
