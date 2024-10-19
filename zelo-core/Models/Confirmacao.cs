public class Confirmacao
{
	public int Codigo
	{
		get;
		set;
	}

	public string? CpfCliente
	{
		get;
		set;
	}

	public string? CpfTrabalhador
	{
		get;
		set;
	}

	public string? CodigoConfirmacao
	{
		get;
		set;
	}

	public Confirmacao()
	{

	}

	public Confirmacao(int codigo, string cpfCliente, string cpfTrabalhador, string codigoConfirmacao)
	{
		this.Codigo = codigo;
		this.CpfCliente = cpfCliente;
		this.CpfTrabalhador = cpfTrabalhador;
		this.CodigoConfirmacao = codigoConfirmacao;
	}
}
