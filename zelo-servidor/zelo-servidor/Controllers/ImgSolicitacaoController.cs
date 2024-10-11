﻿using MySql.Data.MySqlClient;
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

    public void DeletarImgs(int cdSolicitacao)
    {
        Banco banco = new Banco();
        banco.Conectar();

        string comando = $@"DELETE FROM img_solicitacao
        WHERE cd_solicitacao = {cdSolicitacao}";
        banco.Executar(comando);
    }

    [HttpGet]
    [Route("CarregarImgs")]
    public string CarregarImgs()
    {
        Banco banco = new Banco();
        banco.Conectar();

        int cdSolicitacao = int.Parse(Request["c"]);

        #region Carrega as imgs do banco e envia

        string comando = $"SELECT * FROM img_solicitacao WHERE cd_solicitacao_servico = {cdSolicitacao}";

        if (!String.IsNullOrEmpty(Request["q"]))
        {
            comando = $"SELECT * FROM img_solicitacao WHERE cd_solicitacao_servico = {cdSolicitacao} LIMIT {Request["q"]}";
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

        return JsonConvert.SerializeObject(lista, Formatting.Indented);

        #endregion
    }
}