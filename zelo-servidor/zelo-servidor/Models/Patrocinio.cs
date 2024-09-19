using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


public class Patrocinio
{
	private string _cpfTrabalhador;

	public string CpfTrabalhador
	{
		get { return _cpfTrabalhador; }
		set { _cpfTrabalhador = value; }
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

	public Patrocinio()
	{

	}

	public Patrocinio(string cpf, int semanas, string valor)
	{
		this.CpfTrabalhador = cpf;
		this.QtSemanas = semanas;
	}



}