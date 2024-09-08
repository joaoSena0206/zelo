﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

public class Endereco
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

    private string _cep;

	public string Cep
	{
		get { return _cep; }
		set { _cep = value; }
	}

	private int _numero;

	public int Numero
	{
		get { return _numero; }
		set { _numero = value; }
	}

	private string _complemento;

	public string Complemento
	{
		get { return _complemento; }
		set { _complemento = value; }
	}

	public Endereco()
	{

	}

	public Endereco(int codigo, string cpfCliente, string cep, int numero, string complemento)
    {
		this.Codigo = codigo;
        this.CpfCliente = cpfCliente;
		this.Cep = cep;
        this.Numero = numero;
        this.Complemento = complemento;
    }
}