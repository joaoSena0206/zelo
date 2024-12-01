using MySql.Data.MySqlClient;
using FirebaseAdmin.Messaging;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Mysqlx;

[ApiController]
[Route("Cliente")]
public class ClienteController : ControllerBase
{
    [HttpPost("Adicionar")]
    public IActionResult Adicionar()
    {
        Banco banco = new Banco();
        banco.Conectar();

        try
        {
            Cliente cliente = JsonSerializer.Deserialize<Cliente>(Request.Form["cliente"]);

            #region Adiciona o cliente no banco

            string comando = $"Insert into cliente values('{cliente.Cpf}', '{cliente.Nome}', '{cliente.DataNascimento.ToString("yyyy-MM-dd")}','{cliente.Email}', md5('{cliente.Senha}'), false, '')";
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

    [HttpGet("PegarSaldo")]
    public IActionResult PegarSaldo([FromQuery] string cpf)
    {
        Banco banco = new Banco();
        banco.Conectar();

        try
        {
            string comando = $@"SELECT SUM(vl_transacao_carteira)
            FROM transacao_carteira
            WHERE cd_cpf_cliente = '{cpf}'";
            MySqlDataReader dados = banco.Consultar(comando);

            decimal saldo = 0;

            if (dados != null && dados.Read())
            {
                saldo = dados.GetDecimal(0);
            }

            return Ok(saldo);
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
    public async Task<IActionResult> AdicionarFotoPerfil([FromForm] string cpf, [FromForm] IFormFile? file = null)
    {
        try
        {
            string caminhoPasta = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/Imgs/Perfil/Cliente");

            #region Grava a foto de perfil, e caso nula, pega o svg da web e grava no lugar

            if (file != null && file.Length > 0)
            {
                string caminho = Path.Combine(caminhoPasta, $"{cpf}.jpg");

                using var stream = new FileStream(caminho, FileMode.Create);
                await file.CopyToAsync(stream);
            }
            else
            {
                string avatar = "https://joaosena0206.github.io/zelo_imagens/imgs/avatar.jpg";
                string caminhoArquivo = Path.Combine(caminhoPasta, cpf + ".jpg");

                using HttpClient client = new HttpClient();

                byte[] avatarBytes = await client.GetByteArrayAsync(avatar);

                System.IO.File.WriteAllBytes(caminhoArquivo, avatarBytes);

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
            #region Checa a exist�ncia do email e do cpf

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

            string comando = $"UPDATE cliente SET ic_email_confirmado_cliente = true WHERE cd_cpf_cliente = '{cpf}'";
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

                return Ok(json);
            }

            return Ok(cliente);

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

    [HttpPost("EnviarSolicitacao")]
    public async Task<IActionResult> EnviarSolicitacao([FromForm] string token, [FromForm] string endereco, [FromForm] string solicitacao, [FromForm] string[] listaBase64) 
    {      
        try
        {
            List<string> urlImgs = new List<string>();           

            Cliente cliente = JsonSerializer.Deserialize<Cliente>(Request.Form["cliente"]);

            var msg = new Message()
            {
                Notification = new Notification()
                {
                    Title = "Solicita��o de servi�o",
                    Body = $"Enviada por {cliente.Nome}"
                },
                Data = new Dictionary<string, string>()
                {
                    {"cliente", JsonSerializer.Serialize(cliente)},
                    {"endereco", endereco},
                    {"solicitacao", solicitacao}
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

    [HttpPost("CancelarSolicitacao")]
    async public Task<IActionResult> CancelarSolicitacao([FromForm] string situacaoServico, [FromForm] string token, [FromForm] string nmCliente)
    {
        try
        {
            var msg = new Message()
            {
                Notification = new Notification()
                {
                    Title = "Servi�o cancelado",
                    Body = $"Enviado por {nmCliente}"
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

    [HttpPost("EnviarPagamentoCancelado")]
    async public Task<IActionResult> EnviarPagamentoCancelado([FromForm] string pago, [FromForm] string token, [FromForm] string nmCliente)
    {
        try
        {
            var msg = new Message()
            {
                Notification = new Notification()
                {
                    Title = "Pagamento cancelado",
                    Body = $"Enviado por {nmCliente}"
                },
                Data = new Dictionary<string, string>()
                {
                    {"pago", pago}
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
            string comando = $@"UPDATE cliente SET nm_token_fcm = '{token}'
            WHERE cd_cpf_cliente = '{cpf}'";
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

    [HttpPost("GerarPagamento")]
    public async Task<IActionResult> GerarPagamento([FromForm] string valorVisita, [FromForm] string email, [FromForm] string cpf, [FromForm] string expiracao)
    {
        try
        {
            Random random = new Random();
            string letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
            string codigoAleatorio = "";

            for (int i = 0; i < 5; i++)
            {
                codigoAleatorio += letras[random.Next(letras.Length)];
            }

            string json = @"{'transaction_amount': " + valorVisita + ", 'date_of_expiration': '" + expiracao + "','payment_method_id': 'pix', 'payer': {'email': '" + email + "', 'identification': {'type': 'CPF', 'number': '" + cpf + "'}}}";
            json = json.Replace("'", "\"");

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://api.mercadopago.com");
                client.DefaultRequestHeaders.Add("accept", "application/json");
                client.DefaultRequestHeaders.Add("Authorization", "Bearer APP_USR-3082013782228827-100609-cc86dc20c3f8c6503eaec74da331b475-2021112151");
                client.DefaultRequestHeaders.Add("X-Idempotency-Key", codigoAleatorio);

                var content = new StringContent(json, Encoding.UTF8, "application/json");
                var result = await client.PostAsync("/v1/payments", content);
                var res = await result.Content.ReadAsStringAsync();

                return Ok(res);
            }
        }
        catch (Exception erro)
        {
            return BadRequest(erro.Message);
        }
    }

    [HttpGet("ChecarPagamento")]
    public async Task<IActionResult> ChecarPagamento([FromQuery] string id)
    {
        try
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri($"https://api.mercadopago.com");
                client.DefaultRequestHeaders.Add("Authorization", "Bearer APP_USR-3082013782228827-100609-cc86dc20c3f8c6503eaec74da331b475-2021112151");

                var result = await client.GetAsync($"/v1/payments/{id}");
                var res = await result.Content.ReadAsStringAsync();

                return Ok(res);
            }
        }
        catch (Exception erro)
        {
            return BadRequest(erro.Message);
        } 
    }

    [HttpPost("EnviarConfirmacao")]
    public async Task<IActionResult> EnviarConfirmacao([FromForm] string token, [FromForm] string solicitacao)
    {
        try
        {
            Cliente cliente = JsonSerializer.Deserialize<Cliente>(Request.Form["cliente"]);

            var msg = new Message()
            {
                Notification = new Notification()
                {
                    Title = "Pagamento confirmado",
                    Body = $"Pago por {cliente.Nome}"
                },
                Data = new Dictionary<string, string>()
            {
                {"pago", "true"},
                {"solicitacao", solicitacao}
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

    [HttpPost("PegarTokenFCM")]
    public IActionResult PegarTokenFCM([FromForm] string cpf)
    {
        Banco banco = new Banco();
        banco.Conectar();

        try
        {
            string comando = $@"select nm_token_fcm from cliente where cd_cpf_cliente = {cpf};";
            MySqlDataReader dados = banco.Consultar(comando);

            Cliente cliente = new Cliente();

            if (dados != null && dados.Read())
            {
                cliente.TokenFCM = dados.GetString(0);
            }

            return Ok(cliente.TokenFCM);
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

    [HttpGet("RetornaTexto")]
    public string RetornaTexto()
    {
        return "Marco viado";
    }

    [HttpGet("RetornaTexto2")]
    public string RetornaTexto2()
    {
        return "Marco viado";
    }

    [HttpPost("CarregarDadosPerfil")]
    async public Task<IActionResult> CarregarDadosPerfil([FromForm] string cpfCliente)
    {
        Banco banco = new Banco();
        banco.Conectar();

        try
        {
            #region Busca os dados no banco

            string comando = $@"
            select T.cd_cpf_trabalhador, T.nm_trabalhador, SS.qt_estrelas_avaliacao_cliente, SS.dt_solicitacao_servico, SS.ds_comentario_avaliacao_cliente 
            from solicitacao_servico SS 
            join trabalhador T on(SS.cd_cpf_trabalhador = T.cd_cpf_trabalhador) 
            where nm_codigo_aleatorio != '' and SS.cd_cpf_cliente = '{cpfCliente}' and SS.qt_estrelas_avaliacao_cliente != 0";

            MySqlDataReader dados = banco.Consultar(comando);

            List<SolicitacaoServico> listaSolicitacaoServico = new List<SolicitacaoServico>();

            if (dados != null)
            {
                while (dados.Read())
                {
                    SolicitacaoServico servicoTrabalhador = new SolicitacaoServico();
                    Trabalhador trabalhador = new Trabalhador();

                    trabalhador.Cpf = dados.GetString(0);
                    trabalhador.Nome = dados.GetString(1);

                    servicoTrabalhador.QtEstrelasAvaliacaoServico = dados.GetDecimal(2);
                    servicoTrabalhador.DtSolicitacaoServico = dados.GetDateTime(3);

                    servicoTrabalhador.Trabalhador = trabalhador;

                    try
                    {
                        servicoTrabalhador.DsComentarioAvaliacaoCliente = dados.GetString(4);
                    }
                    catch
                    {
                        servicoTrabalhador.DsComentarioAvaliacaoCliente = "";
                    }

                    listaSolicitacaoServico.Add(servicoTrabalhador);
                }
            }

            dados.Close();

            return Ok(listaSolicitacaoServico);

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

    [HttpPost("AlterarEmail")]
    public IActionResult AlterarEmail([FromForm] string cpf, [FromForm] string nome, [FromForm] string email)
    {
        Banco banco = new Banco();
        banco.Conectar();

        try
        {
            string comando = "";

            if (nome == "null")
            {
                comando = $@"UPDATE cliente 
                        SET nm_email_cliente = '{email}'
                        WHERE cd_cpf_cliente = '{cpf}'";
            }
            else
            {
                comando = $@"UPDATE cliente 
                        SET nm_cliente = '{nome}'
                        WHERE cd_cpf_cliente = '{cpf}'";
            }

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

    [HttpPost("VerificarSenha")]
    public IActionResult VerificarSenha([FromForm] string cpf, [FromForm] string senha)
    {
        Banco banco = new Banco();
        banco.Conectar();

        try
        {
            string comando = "";
            int? SenhaConfere = null;

            comando = $@"SELECT EXISTS  ( SELECT 1 FROM cliente WHERE nm_senha_cliente = md5('{senha}') AND cd_cpf_cliente = '{cpf}' ) AS ExisteIgualdade";

            MySqlDataReader dados = banco.Consultar(comando);

            if (dados != null)
            {
                while (dados.Read())
                {
                    SenhaConfere = dados.GetInt16(0);
                }
            }

            dados.Close();

            return Ok(SenhaConfere);
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

    [HttpPost("AlterarSenha")]
    public IActionResult AlterarSenha([FromForm] string cpf, [FromForm] string novaSenha)
    {
        Banco banco = new Banco();
        banco.Conectar();

        try
        {
            string comando = "";

            comando = $@"UPDATE cliente SET nm_senha_cliente = md5('{novaSenha}') WHERE cd_cpf_cliente = '{cpf}'";

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

    [HttpPost("BuscarEndereco")]
    public IActionResult BuscarEndereco([FromForm] string cpf)
    {
        Banco banco = new Banco();
        banco.Conectar();

        try
        {

            string comando = $@"select cd_cep_endereco, nm_identificacao_endereco, cd_numero_endereco, ds_complemento_endereco, nm_referencia_endereco from endereco where cd_cpf_cliente = '{cpf}'";

            MySqlDataReader dados = banco.Consultar(comando);
            List<Endereco> listaEndereco = new List<Endereco>();

            if (dados != null)
            {
                while (dados.Read())
                {
                    Endereco endereco = new Endereco();

                    endereco.Cep = dados.GetString(0);
                    endereco.Identificacao = dados.GetString(1);
                    endereco.Numero = dados.GetInt16(2);
                    endereco.Complemento = dados.GetString(3);
                    endereco.Referencia = dados.GetString(4);

                    listaEndereco.Add(endereco);
                }
            }

            dados.Close();

            return Ok(listaEndereco);
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

    [HttpPost("AlterarEndereco")]
    public IActionResult AlterarEndereco([FromForm] string cpf, [FromForm] string identificacao, [FromForm] string cep, [FromForm] int numero, [FromForm] string complemento, [FromForm] string referencia)
    {
        Banco banco = new Banco();
        banco.Conectar();

        try
        {
            string comando = "";

            comando = $@"UPDATE endereco
                            SET 
                                cd_cep_endereco = '{cep}',
                                nm_identificacao_endereco = '{identificacao}',
                                cd_numero_endereco = {numero},
                                ds_complemento_endereco = '{complemento}',
                                nm_referencia_endereco = '{referencia}'
                            WHERE 
                                cd_cpf_cliente = '{cpf}'";

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
