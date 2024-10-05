using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

public class ImgSolicitacao
{
	private int _codigo;

	public int Codigo
	{
		get { return _codigo; }
		set { _codigo = value; }
	}

	private SolicitacaoServico _solicitacao;

	public SolicitacaoServico Solicitacao
	{
		get { return _solicitacao; }
		set { _solicitacao = value; }
	}

	private string _tipoArquivo;

	public string TipoArquivo
	{
		get { return _tipoArquivo; }
		set { _tipoArquivo = value; }
	}

	public ImgSolicitacao()
	{

	}
}