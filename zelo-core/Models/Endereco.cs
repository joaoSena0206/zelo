public class Endereco
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

	public string? Identificacao
	{
		get;
		set;
	}

	public string? Cep
	{
		get;
		set;
	}

	public int Numero
	{
		get;
		set;
	}

	public string? Complemento
	{
		get;
		set;
	}

	public string? Referencia
	{
		get;
		set;
	}

	public Endereco()
	{

	}

	public Endereco(int codigo, string cpfCliente, string identificacao,string cep, int numero, string complemento, string referencia)
    {
		this.Codigo = codigo;
        this.CpfCliente = cpfCliente;
		this.Identificacao = identificacao;
		this.Cep = cep;
        this.Numero = numero;
        this.Complemento = complemento;
		this.Referencia = referencia;
    }
}
