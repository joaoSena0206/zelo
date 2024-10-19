public class Servico
{
	public int Codigo
	{
		get;
		set;
	}

	public CategoriaServico? Categoria
	{
		get;
		set;
	}

	public string? Nome
	{
		get;
		set;
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
