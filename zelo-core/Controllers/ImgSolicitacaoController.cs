using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("ImgSolicitacao")]
public class ImgSolicitacaoController : ControllerBase
{
    public void AdicionarImgs(int codigoImg, int codigoSolicitacao, string tipoArquivo)
    {
        Banco banco = new Banco();
        banco.Conectar();

        try
        {
            #region Insere as imgs no banco

            string comando = $@"INSERT INTO img_solicitacao VALUES
            (
	            {codigoImg},
	            {codigoSolicitacao},
	            '{tipoArquivo}'
            )";
            banco.Executar(comando);
            
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

    public void DeletarImgs(int cdSolicitacao)
    {
        Banco banco = new Banco();
        banco.Conectar();

        try
        {
            string comando = $@"DELETE FROM img_solicitacao
            WHERE cd_solicitacao_servico = {cdSolicitacao}";
            banco.Executar(comando);
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

    [HttpGet("CarregarImgs")]
    public IActionResult CarregarImgs([FromQuery]int cdSolicitacao)
    {
        Banco banco = new Banco();
        banco.Conectar();

        try
        {
            #region Carrega as imgs do banco e envia

            string comando = $"SELECT * FROM img_solicitacao WHERE cd_solicitacao_servico = {cdSolicitacao}";

            MySqlDataReader dados = banco.Consultar(comando);

            List<ImgSolicitacao> lista = new List<ImgSolicitacao>();

            if (dados != null)
            {
                while (dados.Read())
                {
                    ImgSolicitacao img = new ImgSolicitacao();
                    SolicitacaoServico solicitacao = new SolicitacaoServico();

                    solicitacao.CdSolicitacaoServico = dados.GetInt32(1);

                    img.Codigo = dados.GetInt32(0);
                    img.TipoArquivo = dados.GetString(2);
                    img.Solicitacao = solicitacao;

                    lista.Add(img);
                }
            }

            dados.Close();
           
            return Ok(lista);

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
}
