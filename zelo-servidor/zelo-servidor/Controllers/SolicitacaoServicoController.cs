using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FirebaseAdmin.Messaging;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;

[RoutePrefix("SolicitacaoServico")]
public class SolicitacaoServicoController : Controller
{
    [HttpGet]
    [Route("CarregarUltimosPedidos")]
    public string carregarUltimosPedidos()
    {
        Banco banco = new Banco();
        banco.Conectar();

        string tipo = Request["t"];
        string cpf = Request["c"];

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
        
        banco.Desconectar();

        return JsonConvert.SerializeObject(listaHistorico, Formatting.Indented);
    }

    [HttpPost]
    [Route("AdicionarSolicitacao")]
    public string AdicionarSolicitacao()
    {
        Banco banco = new Banco();
        banco.Conectar();

        string cpf = Request["cpf"];
        int cdServico = int.Parse(Request["codigoServico"]);
        string desc = Request["desc"];
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
        servico.Codigo = cdServico;

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
	        {cdServico},
	        '{dataAtual.ToString("yyyy-MM-dd HH:mm:ss")}',
	        '{desc}'
        )";
        banco.Executar(comando);
        banco.Desconectar();

        AdicionarImgs(codigoSolicitacao, Request.Files);

        #endregion

        return JsonConvert.SerializeObject(solicitacao);
    }

    public void AdicionarImgs(int cdSolicitacao, HttpFileCollectionBase files)
    {
        ImgSolicitacaoController imgSolicitacaoController = new ImgSolicitacaoController();

        string caminhoPasta = Server.MapPath("~/Imgs/Solicitacao/" + cdSolicitacao);

        if (Directory.Exists(caminhoPasta))
        {
            imgSolicitacaoController.DeletarImgs(cdSolicitacao);
            Directory.Delete(caminhoPasta, true);
        }
        else
        {
            Directory.CreateDirectory(caminhoPasta);
        }

        if (Request.Files.Count > 0)
        {
            for(int i = 0; i < files.Count; i++)
            {
                HttpPostedFileBase file = files[i];

                if (file != null && file.ContentLength > 0)
                {
                    string caminho = Path.Combine(caminhoPasta, (i + 1) + Path.GetExtension(file.FileName));
                    imgSolicitacaoController.AdicionarImgs(i + 1, cdSolicitacao, Path.GetExtension(file.FileName));

                    file.SaveAs(caminho);
                }
            }
        }
    }

    [HttpGet]
    [Route("ChecarExistencia")]
    public bool ChecarExistencia()
    {
        Banco banco = new Banco();
        banco.Conectar();

        int cdSolicitacao = int.Parse(Request["c"]);

        string comando = $"SELECT COUNT(cd_solicitacao_servico) FROM solicitacao_servico WHERE cd_solicitacao_servico = {cdSolicitacao}";
        MySqlDataReader dados = banco.Consultar(comando);

        bool existe = false;

        if (dados != null && dados.Read())
        {
            existe = dados.GetBoolean(0);
        }

        dados.Close();
        banco.Desconectar();

        return existe;
    }

    public void AtualizarSolicitacao(SolicitacaoServico solicitacaoServico)
    {
        Banco banco = new Banco();
        banco.Conectar();

        string comando = $@"UPDATE solicitacao_servico SET ds_servico = '{solicitacaoServico.DsServico}'
        WHERE cd_solicitacao_servico = {solicitacaoServico.CdSolicitacaoServico}";
        banco.Executar(comando);
        banco.Desconectar();
    }

    [HttpGet]
    [Route("carregarcomentariosAnonimos")]
    public string carregarcomentariosAnonimos()
    {
        Banco banco = new Banco();
        banco.Conectar();

        string tipo = Request["t"];
        string cpf = Request["c"];

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

        banco.Desconectar();

        return JsonConvert.SerializeObject(listaHistorico, Formatting.Indented);
    }

    [HttpPost]
    [Route("AdicionarTrabalhador")]
    public void AdicionarTrabalhador()
    {
        Banco banco = new Banco();
        banco.Conectar();

        string cdSolicitacao = Request["cd"];
        string cpf = Request["cpf"];

        string comando = $@"UPDATE solicitacao_servico SET cd_cpf_trabalhador = '{cpf}' 
        WHERE cd_solicitacao_servico = {cdSolicitacao}";
        banco.Executar(comando);
        banco.Desconectar();
    }
}
