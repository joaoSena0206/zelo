﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;

[RoutePrefix("SolicitacaoServico")]
public class SolicitacaoServicoController
{
    [HttpGet]
    [Route("CarregarUltimosPedidos")]

    public string carregarAnimais()
    {
        Banco banco = new Banco();
        banco.Conectar();

        MySqlDataReader dados = banco.Consultar("select SS.ds_servico, C.nm_cliente from solicitacao_servico SS join cliente C on(SS.cd_cpf_cliente = C.cd_cpf_cliente) where cd_cpf_trabalhador = 56787654364");
        List<SolicitacaoServico> listaHistorico = new List<SolicitacaoServico>();

        while (dados.Read())
        {
            Cliente cliente = new Cliente();
            Trabalhador trabalhador = new Trabalhador();
            SolicitacaoServico solicitacaoServico = new SolicitacaoServico();

            cliente.Nome = dados.GetString(1);

            solicitacaoServico.DsServico = dados.GetString(0);
            solicitacaoServico.Cliente = cliente;

            listaHistorico.Add(solicitacaoServico);
        }

        if (dados != null)
        {
            if (!dados.IsClosed)
            {
                dados.Close();
            }
        }
        
        banco.Desconectar();

        return JsonConvert.SerializeObject(listaHistorico, Formatting.Indented);

    }
}
