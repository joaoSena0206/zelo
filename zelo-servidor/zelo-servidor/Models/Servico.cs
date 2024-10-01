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

	private CategoriaServico _categoria;

	public CategoriaServico Categoria
	{
		get { return _categoria; }
		set { _categoria = value; }
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

	public Servico(int codigo, CategoriaServico categoria, string nome)
	{
		this.Codigo = codigo;
		this.Categoria = categoria;
		this.Nome = nome;
	}
}
