public class TransacaoCarteira
{
    public int Codigo { get; set; }
    public Cliente? Cliente { get; set; }
    public Trabalhador? Trabalhador { get; set; }
    public decimal Valor { get; set; }
    public DateTime Data { get; set; }

    public TransacaoCarteira()
    {

    }
}
