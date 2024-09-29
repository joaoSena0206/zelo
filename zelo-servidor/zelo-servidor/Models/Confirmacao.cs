using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

public class Confirmacao
{
	private int _codigo;

	public int Codigo
	{
		get { return _codigo; }
		set { _codigo = value; }
	}

	private string _cpfCliente;

	public string CpfCliente
	{
		get { return _cpfCliente; }
		set { _cpfCliente = value; }
	}

	private string _cpfTrabalhador;

	public string CpfTrabalhador
	{
		get { return _cpfTrabalhador; }
		set { _cpfTrabalhador = value; }
	}

	private string _codigoConfirmacao;

	public string CodigoConfirmacao
	{
		get { return _codigoConfirmacao; }
		set { _codigoConfirmacao = value; }
	}

	public Confirmacao()
	{

	}

	public Confirmacao(int codigo, string cpfCliente, string cpfTrabalhador, string codigoConfirmacao)
	{
		this.Codigo = codigo;
		this.CpfCliente = cpfCliente;
		this.CpfTrabalhador = cpfTrabalhador;
		this.CodigoConfirmacao = codigoConfirmacao;
	}
}
