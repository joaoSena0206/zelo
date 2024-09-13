using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

public class Cliente
{
	private string _cpf;

	public string Cpf
	{
		get { return _cpf; }
		set { _cpf = value; }
	}

	private string _nome;

	public string Nome
	{
		get { return _nome; }
		set { _nome = value; }
	}

	private string _dataNascimento;

	public string DataNascimento
	{
		get { return _dataNascimento; }
		set { _dataNascimento = value; }
	}

	private string _email;

	public string Email
	{
		get { return _email; }
		set { _email = value; }
	}

	private string _senha;

	public string Senha
	{
		get { return _senha; }
		set { _senha = value; }
	}

    private bool _confirmado;

    public bool Confirmado
    {
        get { return _confirmado; }
        set { _confirmado = value; }
    }


    public Cliente()
	{

	}

	public Cliente(string cpf, string nome, string email, string senha)
	{
		this.Cpf = cpf;
		this.Nome = nome;
		this.Email = email;
		this.Senha = senha;
	}
}