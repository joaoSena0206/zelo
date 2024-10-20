public class Cliente
{
    public string? Cpf
	{
		get;
		set;
	}

	public string? Nome
	{
		get;
		set;
	}

	public DateTime DataNascimento
	{
		get;
		set;
	}

	public string? Email
	{
		get;
		set;
	}

	public string? Senha
	{
		get;
		set;
	}

    public bool Confirmado
    {
		get;
		set;
    }

    public string? TokenFCM
    {
		get;
		set;
    }

    public Cliente()
	{

	}

	public Cliente(string cpf, string nome, DateTime dataNascimento,string email, string senha, bool confirmado, string token)
	{
		this.Cpf = cpf;
		this.Nome = nome;
		this.DataNascimento = dataNascimento;
		this.Email = email;
		this.Senha = senha;
		this.Confirmado = confirmado;
        this.TokenFCM = token;
    }
}
