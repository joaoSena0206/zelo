public class SolicitacaoServico
{
	public int CdSolicitacaoServico
	{
		get;
		set;
	}

	public Trabalhador? Trabalhador
	{
		get;
		set;
	}

    public Cliente? Cliente
    {
		get;
		set;
    }

	public Servico? Servico
	{
		get;
		set;
	}

	public DateTime DtSolicitacaoServico
	{
		get;
		set;
	}

	public string? DsServico
	{
		get;
		set;
	}

	public string? DsComentarioAvaliacaoServico
	{
		get;
		set;
	}

	public decimal QtEstrelasAvaliacaoServico
	{
		get;
		set;
	}

	public string? DsComentarioAvaliacaoCliente
	{
		get;
		set;
	}

    public decimal QtEstrelasAvaliacaoCliente
    {
		get;
		set;
    }

    public string NmCodigoAleatorio
    {
        get;
        set;
    }

    public SolicitacaoServico(int cdSolicitacaoServico, Trabalhador trabalhador, Cliente cliente, DateTime dtSolicitacaoServico, string dsServico, string dsComentarioAvaliacaoServico, int qtEstrelasAvaliacaoServico, string dsComentarioAvaliacaoCliente, int qtEstrelasAvaliacaoCliente, Servico servico, string nmCodigoAleatorio)
    {
        CdSolicitacaoServico = cdSolicitacaoServico;
        Trabalhador = trabalhador;
        Cliente = cliente;
        DtSolicitacaoServico = dtSolicitacaoServico;
        DsServico = dsServico;
        DsComentarioAvaliacaoServico = dsComentarioAvaliacaoServico;
        QtEstrelasAvaliacaoServico = qtEstrelasAvaliacaoServico;
        DsComentarioAvaliacaoCliente = dsComentarioAvaliacaoCliente;
        QtEstrelasAvaliacaoCliente = qtEstrelasAvaliacaoCliente;
		Servico = servico;
		NmCodigoAleatorio = nmCodigoAleatorio;
    }

    public SolicitacaoServico()
    {
    }
}
