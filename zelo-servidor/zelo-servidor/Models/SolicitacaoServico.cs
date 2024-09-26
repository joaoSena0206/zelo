using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


public class SolicitacaoServico
{
	private int _cdSolicitacaoServico;

	public int CdSolicitacaoServico
	{
		get { return _cdSolicitacaoServico; }
		set { _cdSolicitacaoServico = value; }
	}

	private Trabalhador _trabalhador;

	public Trabalhador Trabalhador
	{
		get { return _trabalhador; }
		set { _trabalhador = value; }
	}

    private Cliente _cliente;

    public Cliente Cliente
    {
        get { return _cliente; }
        set { _cliente = value; }
    }

	private Servico _servico;

	public Servico Servico
	{
		get { return _servico; }
		set { _servico = value; }
	}


	private DateTime _dtSolicitacaoServico;

	public DateTime DtSolicitacaoServico
	{
		get { return _dtSolicitacaoServico; }
		set { _dtSolicitacaoServico = value; }
	}

	private string _dsServico;

	public string DsServico
	{
		get { return _dsServico; }
		set { _dsServico = value; }
	}

	private string _dsComentarioAvaliacaoServico;

	public string DsComentarioAvaliacaoServico
	{
		get { return _dsComentarioAvaliacaoServico; }
		set { _dsComentarioAvaliacaoServico = value; }
	}

	private int _qtEstrelasAvaliacaoServico;

	public int QtEstrelasAvaliacaoServico
	{
		get { return _qtEstrelasAvaliacaoServico; }
		set { _qtEstrelasAvaliacaoServico = value; }
	}

	private string _dsComentarioAvaliacaoCliente;

	public string DsComentarioAvaliacaoCliente
	{
		get { return _dsComentarioAvaliacaoCliente; }
		set { _dsComentarioAvaliacaoCliente = value; }
	}

    private int _qtEstrelasAvaliacaoCliente;

    public int QtEstrelasAvaliacaoCliente
    {
        get { return _qtEstrelasAvaliacaoCliente; }
        set { _qtEstrelasAvaliacaoCliente = value; }
    }


	public SolicitacaoServico(int cdSolicitacaoServico, Trabalhador trabalhador, Cliente cliente, DateTime dtSolicitacaoServico, string dsServico, string dsComentarioAvaliacaoServico, int qtEstrelasAvaliacaoServico, string dsComentarioAvaliacaoCliente, int qtEstrelasAvaliacaoCliente, Servico servico)
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
    }

    public SolicitacaoServico()
    {
    }
}
