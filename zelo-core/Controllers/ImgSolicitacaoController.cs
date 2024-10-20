using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("ImgSolicitacao")]
public class ImgSolicitacaoController : ControllerBase
{
    public void AdicionarImgs(int codigoImg, int codigoSolicitacao, string tipoArquivo)
    {
        try
        {
            Banco banco = new Banco();
            banco.Conectar();

            #region Insere as imgs no banco

            string comando = $@"INSERT INTO img_solicitacao VALUES
            (
	            {codigoImg},
	            {codigoSolicitacao},
	            '{tipoArquivo}'
            )";
            banco.Executar(comando);
            banco.Desconectar();

            #endregion
        }
        catch (Exception erro)
        {
            throw new Exception(erro.Message);
        }

    }

    public void DeletarImgs(int cdSolicitacao)
    {
        try
        {
            Banco banco = new Banco();
            banco.Conectar();

            string comando = $@"DELETE FROM img_solicitacao
            WHERE cd_solicitacao_servico = {cdSolicitacao}";
            banco.Executar(comando);
        }
        catch (Exception erro)
        {
            throw new Exception(erro.Message);
        }
        
    }

    [HttpGet("CarregarImgs")]
    public IActionResult CarregarImgs([FromQuery]int cdSolicitacao, [FromQuery]string quantidade)
    {
        try
        {
            Banco banco = new Banco();
            banco.Conectar();

            #region Carrega as imgs do banco e envia

            string comando = $"SELECT * FROM img_solicitacao WHERE cd_solicitacao_servico = {cdSolicitacao}";

            if (!String.IsNullOrEmpty(quantidade))
            {
                comando = $"SELECT * FROM img_solicitacao WHERE cd_solicitacao_servico = {cdSolicitacao} LIMIT {quantidade}";
            }

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
            banco.Desconectar();

            return Ok(lista);

            #endregion
        }
        catch (Exception erro)
        {
            return BadRequest(erro.Message);
        }

    }
}
