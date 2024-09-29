using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

public class Servico
{
	private int _codigo;

	public int Codigo
	{
		get { return _codigo; }
		set { _codigo = value; }
	}

	private int _codigoCategoria;

	public int CodigoCategoria
	{
		get { return _codigoCategoria; }
		set { _codigoCategoria = value; }
	}

	private string _nome;

	public string Nome
	{
		get { return _nome; }
		set { _nome = value; }
	}

	public Servico()
	{

	}

	public Servico(int codigo, int codigoCategoria, string nome)
	{
		this.Codigo = codigo;
		this.CodigoCategoria = codigoCategoria;
		this.Nome = nome;
	}
}
