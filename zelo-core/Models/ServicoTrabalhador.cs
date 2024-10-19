public class ServicoTrabalhador
{
	public Trabalhador? Trabalhador
	{
		get;
		set;
	}

	public Servico? Servico
	{
		get;
		set;
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
