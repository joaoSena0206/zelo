public class Trabalhador
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

    public DateTime DataCadastro
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

    public string? Pix
    {
        get;
        set;
    }

    public bool Disponivel
    {
        get;
        set;
    }

    public bool Confirmado
    {
        get;
        set;
    }

    public decimal Avaliacao
    {
        get;
        set;
    }

    public decimal ValorVisita
    {
        get;
        set;
    }

    public decimal LatitudeAtual
    {
        get;
        set;
    }

    public decimal LongitudeAtual
    {
        get;
        set;
    }

    public string? TokenFCM
    {
        get;
        set;
    }

    public decimal SaldoCarteira
    {
        get;
        set;
    }

    public Trabalhador()
    {

    }

    public Trabalhador(string cpf, string nome, DateTime dataNascimento, DateTime dataCadastro,string email, string senha, string pix, bool disponivel, decimal avaliacao, decimal valorVisita, decimal lat, decimal longitude, string token, decimal saldoCarteira)
    {
        this.Cpf = cpf;
        this.Nome = nome;
        this.DataNascimento = dataNascimento;
        this.DataCadastro = dataCadastro;
        this.Email = email;
        this.Senha = senha;
        this.Pix = pix;
        this.Disponivel = disponivel;
        this.Avaliacao = avaliacao;
        this.ValorVisita = valorVisita;
        this.LatitudeAtual = lat;
        this.LongitudeAtual = longitude;
        this.TokenFCM = token;
        this.SaldoCarteira = saldoCarteira;
    }
}
