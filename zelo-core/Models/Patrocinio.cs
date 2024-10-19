public class Patrocinio
{
	public Trabalhador? Trabalhador
	{
		get;
		set;
	}

	public int QtSemanas
	{
		get;
		set;
	}

	public string? Valor
	{
		get;
		set;
	}

	public DateTime DtAdesao
	{
		get;
		set;
	}

	public Servico? Servico
	{
		get;
		set;
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
