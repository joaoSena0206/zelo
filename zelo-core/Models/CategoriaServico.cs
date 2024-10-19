public class CategoriaServico
{
	public int Codigo
	{
		get;
		set;
	}

	public string? Nome
	{
		get;
		set;
	}

	public CategoriaServico()
	{

	}

	public CategoriaServico(int codigo, string nome)
	{
		this.Codigo = codigo;
		this.Nome = nome;
	}
}
