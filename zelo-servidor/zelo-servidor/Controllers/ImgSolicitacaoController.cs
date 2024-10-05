using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

[RoutePrefix("ImgSolicitacao")]
public class ImgSolicitacaoController : Controller
{
    public void AdicionarImgs(int codigoImg, int codigoSolicitacao, string tipoArquivo)
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

    [HttpGet]
    [Route("CarregarImgs")]
    public string CarregarImgs(int cdSolicitacao)
    {
        Banco banco = new Banco();
        banco.Conectar();

        #region Carrega as imgs do banco e envia

        string comando = $"SELECT * FROM img_solicitacao";
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

        return JsonConvert.SerializeObject(lista, Formatting.Indented);

        #endregion
    }
}