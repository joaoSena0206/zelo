using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


public class Patrocinio
{
	private Trabalhador _trabalhador;

	public Trabalhador Trabalhador
	{
		get { return _trabalhador; }
		set { _trabalhador = value; }
	}

	private int _qtSemanas;

	public int QtSemanas
	{
		get { return _qtSemanas; }
		set { _qtSemanas = value; }
	}

	private string _valor;

	public string Valor
	{
		get { return _valor; }
		set { _valor = value; }
	}

	private DateTime _dtAdesao;

	public DateTime DtAdesao
	{
		get { return _dtAdesao; }
		set { _dtAdesao = value; }
	}

	private Servico _servico;

	public Servico Servico
	{
		get { return _servico; }
		set { _servico = value; }
	}



	public Patrocinio()
	{

	}

	public Patrocinio(Trabalhador trabalhador, int semanas, string valor, DateTime dataAdesao, Servico servico)
	{
		this.Trabalhador = trabalhador;
		this.QtSemanas = semanas;
		this.Valor = valor;
		this.DtAdesao = dataAdesao;
		this.Servico = servico;
	}
}
