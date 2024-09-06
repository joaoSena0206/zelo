using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


public class Trabalhador
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

    private string _pix;

    public string Pix
    {
        get { return _pix; }
        set { _pix = value; }
    }

    private bool _disponivel;

    public bool Disponivel
    {
        get { return _disponivel; }
        set { _disponivel = value; }
    }

    public Trabalhador()
    {

    }

    public Trabalhador(string cpf, string nome, string email, string senha, string pix, bool disponivel)
    {
        this.Cpf = cpf;
        this.Nome = nome;
        this.Email = email;
        this.Senha = senha;
        this.Pix = pix;
        this.Disponivel = disponivel;
    }
}
