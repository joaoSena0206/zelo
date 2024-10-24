using MySql.Data.MySqlClient;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

[ApiController]
[Route("SolicitacaoServico")]
public class SolicitacaoServicoController : ControllerBase
{
    [HttpGet("CarregarUltimosPedidos")]
    public IActionResult carregarUltimosPedidos([FromQuery] string cpf, [FromQuery]string tipo)
    {
        Banco banco = new Banco();
        banco.Conectar();
        try
        {

            string comando = $@"SELECT nm_trabalhador, nm_servico, dt_solicitacao_servico, vl_visita_trabalhador, ss.cd_cpf_trabalhador, ss.cd_servico FROM solicitacao_servico ss
            JOIN trabalhador t ON (ss.cd_cpf_trabalhador = t.cd_cpf_trabalhador)
            JOIN servico s ON (ss.cd_servico = s.cd_servico)
            WHERE ss.cd_cpf_cliente = '{cpf}' ORDER BY dt_solicitacao_servico DESC";

            if (tipo == "trabalhador")
            {
                comando = $"select SS.ds_servico, C.nm_cliente, SS.cd_solicitacao_servico from solicitacao_servico SS join cliente C on(SS.cd_cpf_cliente = C.cd_cpf_cliente) where cd_cpf_trabalhador = {cpf} ORDER BY dt_solicitacao_servico DESC LIMIT 5";
            }

            MySqlDataReader dados = banco.Consultar(comando);

            List<SolicitacaoServico> listaHistorico = new List<SolicitacaoServico>();
            TrabalhadorController trabalhadorController = new TrabalhadorController();

            if (dados != null)
            {
                while (dados.Read())
                {
                    if (tipo == "cliente")
                    {
                        SolicitacaoServico solicitacaoServico = new SolicitacaoServico();
                        Trabalhador trabalhador = new Trabalhador();
                        Servico servico = new Servico();

                        trabalhador.Cpf = dados.GetString(4);
                        trabalhador.Nome = dados.GetString(0);
                        trabalhador.ValorVisita = dados.GetDecimal(3);
                        trabalhador.Avaliacao = trabalhadorController.PegarEstrelas(trabalhador.Cpf);

                        servico.Codigo = dados.GetInt32(5);
                        servico.Nome = dados.GetString(1);

                        solicitacaoServico.Trabalhador = trabalhador;
                        solicitacaoServico.Servico = servico;
                        solicitacaoServico.DtSolicitacaoServico = dados.GetDateTime(2);

                        listaHistorico.Add(solicitacaoServico);
                    }
                    else
                    {
                        Cliente cliente = new Cliente();
                        SolicitacaoServico solicitacaoServico = new SolicitacaoServico();

                        cliente.Nome = dados.GetString(1);

                        solicitacaoServico.DsServico = dados.GetString(0);
                        solicitacaoServico.CdSolicitacaoServico = dados.GetInt32(2);
                        solicitacaoServico.Cliente = cliente;

                        listaHistorico.Add(solicitacaoServico);
                    }
                }
            }

            if (!dados.IsClosed)
            {
                dados.Close();
            }

            return Ok(listaHistorico);
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

    [HttpPost("AdicionarSolicitacao")]
    public IActionResult AdicionarSolicitacao([FromForm]string cpf, [FromForm] int codigoServico, [FromForm]string desc)
    {
        Banco banco = new Banco();
        banco.Conectar();
        try
        {

            int codigoSolicitacao = 0;

            DateTime dataAtual = DateTime.Now;
            SolicitacaoServico solicitacao = new SolicitacaoServico();
            Cliente cliente = new Cliente();
            Servico servico = new Servico();

            #region Adiciona a solicitação no banco e no servidor

            #region Pega o maior cd

            string comando = "SELECT IFNULL(MAX(cd_solicitacao_servico) + 1, 1) FROM solicitacao_servico";
            MySqlDataReader dados = banco.Consultar(comando);

            if (dados != null && dados.Read())
            {
                codigoSolicitacao = dados.GetInt32(0);
            }

            dados.Close();

            #endregion

            cliente.Cpf = cpf;
            servico.Codigo = codigoServico;

            solicitacao.CdSolicitacaoServico = codigoSolicitacao;
            solicitacao.Cliente = cliente;
            solicitacao.Servico = servico;
            solicitacao.DtSolicitacaoServico = dataAtual;
            solicitacao.DsServico = desc;

            comando = $@"INSERT INTO solicitacao_servico 
            (
	            cd_solicitacao_servico,
	            cd_cpf_cliente,
	            cd_servico,
	            dt_solicitacao_servico,
	            ds_servico
            )
            VALUES
            (
	            {codigoSolicitacao},
	            '{cpf}',
	            {codigoServico},
	            '{dataAtual.ToString("yyyy-MM-dd HH:mm:ss")}',
	            '{desc}'
            )";
            banco.Executar(comando);
            banco.Desconectar();

            AdicionarImgs(codigoSolicitacao, Request.Form.Files);

            #endregion

            return Ok(solicitacao);
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

    public void AdicionarImgs(int cdSolicitacao, IFormFileCollection files)
    {
        try
        {
            ImgSolicitacaoController imgSolicitacaoController = new ImgSolicitacaoController();

            string caminhoPasta = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/Imgs/Solicitacao", cdSolicitacao.ToString());

            if (Directory.Exists(caminhoPasta))
            {
                imgSolicitacaoController.DeletarImgs(cdSolicitacao);
                Directory.Delete(caminhoPasta, true);
            }

            Directory.CreateDirectory(caminhoPasta);


            if (Request.Form.Files.Count > 0)
            {
                for (int i = 0; i < files.Count; i++)
                {
                    IFormFile file = files[i];

                    if (file != null && file.Length > 0)
                    {
                        string caminho = Path.Combine(caminhoPasta, (i + 1) + Path.GetExtension(file.FileName));
                        imgSolicitacaoController.AdicionarImgs(i + 1, cdSolicitacao, Path.GetExtension(file.FileName));

                        using var stream = new FileStream(caminho, FileMode.Create);
                        file.CopyToAsync(stream);
                    }
                }
            }
        }
        catch (Exception erro)
        {
            throw new Exception(erro.Message);
        }
        
    }

    [HttpPost("AtualizarSituacao")]
    public IActionResult AtualizarSolicitacao()
    {
        Banco banco = new Banco();
        banco.Conectar();
        try
        {
            SolicitacaoServico solicitacaoServico = JsonSerializer.Deserialize<SolicitacaoServico>(Request.Form["solicitacaoServico"]);

            string comando = $@"UPDATE solicitacao_servico SET ds_servico = '{solicitacaoServico.DsServico}'
            WHERE cd_solicitacao_servico = {solicitacaoServico.CdSolicitacaoServico}";
            banco.Executar(comando);

            AdicionarImgs(solicitacaoServico.CdSolicitacaoServico, Request.Form.Files);

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

    [HttpGet("carregarcomentariosAnonimos")]
    public IActionResult carregarcomentariosAnonimos([FromQuery] string cpf, [FromQuery] string tipo)
    {
        Banco banco = new Banco();
        banco.Conectar();

        try
        {
            string comando = "";

            if (tipo == "trabalhador")
            {
                comando = $"select ds_comentario_avaliacao_servico, qt_estrelas_avaliacao_servico from solicitacao_servico where cd_cpf_trabalhador = {cpf} AND ds_comentario_avaliacao_servico IS NOT NULL ORDER BY RAND() LIMIT 5";
            }

            MySqlDataReader dados = banco.Consultar(comando);

            List<SolicitacaoServico> listaHistorico = new List<SolicitacaoServico>();
            TrabalhadorController trabalhadorController = new TrabalhadorController();

            if (dados != null)
            {
                while (dados.Read())
                {
                    SolicitacaoServico solicitacaoServico = new SolicitacaoServico();

                    solicitacaoServico.DsComentarioAvaliacaoServico = dados.GetString(0);
                    solicitacaoServico.QtEstrelasAvaliacaoServico = dados.GetInt32(1);

                    listaHistorico.Add(solicitacaoServico);

                }
            }

            if (!dados.IsClosed)
            {
                dados.Close();
            }

            return Ok(listaHistorico);
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

    [HttpPost("AdicionarTrabalhador")]
    public IActionResult AdicionarTrabalhador([FromForm]string cdSolicitacao, [FromForm]string cpf)
    {
        Banco banco = new Banco();
        banco.Conectar();

        try
        {
            string comando = $@"UPDATE solicitacao_servico SET cd_cpf_trabalhador = '{cpf}' 
            WHERE cd_solicitacao_servico = {cdSolicitacao}";
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

    [HttpGet("CarregarHistoricoTrabalhador")]
    public IActionResult CarregarHisotricoTrabalhador([FromQuery] string cpf, [FromQuery]string tipo)
    {
        Banco banco = new Banco();
        banco.Conectar();

        try
        {
            List<SolicitacaoServico> listahistoricotrabalhador = new List<SolicitacaoServico>();

            string comando = $@"SELECT 
                            cliente.nm_cliente,
                            solicitacao_servico.dt_solicitacao_servico,
                            solicitacao_servico.ds_servico,
                            solicitacao_servico.qt_estrelas_avaliacao_servico,
                            solicitacao_servico.cd_solicitacao_servico
                        FROM 
                            cliente
                        JOIN 
                            solicitacao_servico
                        ON 
                            cliente.cd_cpf_cliente = solicitacao_servico.cd_cpf_cliente where solicitacao_servico.cd_cpf_trabalhador = '{cpf}' order by solicitacao_servico.dt_solicitacao_servico desc";

            MySqlDataReader dados = banco.Consultar(comando);

            if (dados != null)
            {
                while (dados.Read())
                {
                    SolicitacaoServico solicitacaoServico = new SolicitacaoServico();
                    Cliente cliente = new Cliente();

                    cliente.Nome = dados.GetString("nm_cliente");
                    solicitacaoServico.Cliente = cliente;
                    solicitacaoServico.DtSolicitacaoServico = dados.GetDateTime("dt_solicitacao_servico");
                    solicitacaoServico.DsServico = dados.GetString("ds_servico");
                    solicitacaoServico.QtEstrelasAvaliacaoServico = dados.GetDecimal(3);
                    solicitacaoServico.CdSolicitacaoServico = dados.GetInt16(4);

                    listahistoricotrabalhador.Add(solicitacaoServico);
                }
            }

            if (!dados.IsClosed)
            {
                dados.Close();
            }

            return Ok(listahistoricotrabalhador);
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
