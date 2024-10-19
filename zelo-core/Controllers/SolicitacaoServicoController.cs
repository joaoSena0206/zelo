using MySql.Data.MySqlClient;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

[Route("SolicitacaoServico")]
public class SolicitacaoServicoController : Controller
{
    [HttpGet("CarregarUltimosPedidos")]
    public string carregarUltimosPedidos()
    {
        Banco banco = new Banco();
        banco.Conectar();

        string tipo = Request.Query["t"];
        string cpf = Request.Query["c"];

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

    [HttpPost("AdicionarSolicitacao")]
    public string AdicionarSolicitacao()
    {
        Banco banco = new Banco();
        banco.Conectar();

        string cpf = Request.Query["cpf"];
        int cdServico = int.Parse(Request.Query["codigoServico"]);
        string desc = Request.Query["desc"];
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

        AdicionarImgs(codigoSolicitacao, Request.Form.Files);

        #endregion

        return JsonConvert.SerializeObject(solicitacao);
    }

    public void AdicionarImgs(int cdSolicitacao, IFormFileCollection files)
    {
        ImgSolicitacaoController imgSolicitacaoController = new ImgSolicitacaoController();

        string caminhoPasta = Path.Combine(Directory.GetCurrentDirectory(), "Imgs/Solicitacao", cdSolicitacao.ToString());

        if (Directory.Exists(caminhoPasta))
        {
            imgSolicitacaoController.DeletarImgs(cdSolicitacao);
            Directory.Delete(caminhoPasta, true);
        }
        
        Directory.CreateDirectory(caminhoPasta);
        

        if (Request.Form.Files.Count > 0)
        {
            for(int i = 0; i < files.Count; i++)
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

    [HttpPost("AtualizarSituacao")]
    public void AtualizarSolicitacao()
    {
        Banco banco = new Banco();
        banco.Conectar();

        SolicitacaoServico solicitacaoServico = JsonConvert.DeserializeObject<SolicitacaoServico>(Request.Query["solicitacao"]);

        string comando = $@"UPDATE solicitacao_servico SET ds_servico = '{solicitacaoServico.DsServico}'
        WHERE cd_solicitacao_servico = {solicitacaoServico.CdSolicitacaoServico}";
        banco.Executar(comando);
        banco.Desconectar();

        AdicionarImgs(solicitacaoServico.CdSolicitacaoServico, Request.Form.Files);
    }

    [HttpGet("carregarcomentariosAnonimos")]
    public string carregarcomentariosAnonimos()
    {
        Banco banco = new Banco();
        banco.Conectar();

        string tipo = Request.Query["t"];
        string cpf = Request.Query["c"];

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

    [HttpPost("AdicionarTrabalhador")]
    public void AdicionarTrabalhador()
    {
        Banco banco = new Banco();
        banco.Conectar();

        string cdSolicitacao = Request.Query["cd"];
        string cpf = Request.Query["cpf"];

        string comando = $@"UPDATE solicitacao_servico SET cd_cpf_trabalhador = '{cpf}' 
        WHERE cd_solicitacao_servico = {cdSolicitacao}";
        banco.Executar(comando);
        banco.Desconectar();
    }

    [HttpGet("CarregarHistoricoTrabalhador")]
    public string CarregarHisotricoTrabalhador()
    {
        List<SolicitacaoServico> listahistoricotrabalhador = new List<SolicitacaoServico>();
        Banco banco = new Banco();
        banco.Conectar();

        string cdSolicitacao = Request.Query["cd"];
        string cpf = Request.Query["c"];

        string comando = $@"SELECT 
                            cliente.nm_cliente,
                            solicitacao_servico.dt_solicitacao_servico,
                            solicitacao_servico.ds_servico,
                            solicitacao_servico.qt_estrelas_avaliacao_servico
                        FROM 
                            cliente
                        JOIN 
                            solicitacao_servico
                        ON 
                            cliente.cd_cpf_cliente = solicitacao_servico.cd_cpf_cliente where solicitacao_servico.cd_cpf_trabalhador = '{cpf}'";

        MySqlDataReader dados = banco.Consultar(comando);

        if (dados != null)
        {
            while (dados.Read())
            {
                SolicitacaoServico solicitacaoServico= new SolicitacaoServico();
                Cliente cliente = new Cliente();

                cliente.Nome = dados.GetString("nm_cliente");
                solicitacaoServico.Cliente = cliente;
                solicitacaoServico.DtSolicitacaoServico = dados.GetDateTime("dt_solicitacao_servico");
                solicitacaoServico.DsServico = dados.GetString("ds_servico");
                solicitacaoServico.QtEstrelasAvaliacaoServico = dados.GetDecimal(3);

                listahistoricotrabalhador.Add(solicitacaoServico);
            }
        }

        if (!dados.IsClosed)
        {
            dados.Close();
        }

        banco.Desconectar();

        return JsonConvert.SerializeObject(listahistoricotrabalhador, Formatting.Indented);
    }
}