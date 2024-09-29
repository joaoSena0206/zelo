using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

public class ServicoTrabalhador
{
	private Trabalhador _trabalhador;

	public Trabalhador Trabalhador
	{
		get { return _trabalhador; }
		set { _trabalhador = value; }
	}

	private Servico _servico;

	public Servico Servico
	{
		get { return _servico; }
		set { _servico = value; }
	}

	public ServicoTrabalhador()
	{

	}

    public ServicoTrabalhador(Trabalhador trabalhador, Servico servico)
    {
        Trabalhador = trabalhador;
        Servico = servico;
    }
}