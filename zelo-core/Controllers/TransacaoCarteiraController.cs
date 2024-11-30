using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("TransacaoCarteira")]
public class TransacaoCarteiraController : ControllerBase
{
    [HttpPost("AdicionarTransacao")]
    public IActionResult AdicionarTransacao([FromForm] decimal valor, [FromForm] string cpf, [FromForm] bool cliente)
    {
        Banco banco = new Banco();
        banco.Conectar();

        try
        {
            DateTime data = DateTime.Now;

            string comando = $@"INSERT INTO transacao_carteira (cd_transacao_carteira, cd_cpf_cliente, cd_cpf_trabalhador, vl_transacao_carteira, dt_transacao_carteira)
            VALUES
            (
	            (SELECT IFNULL(MAX(cd_transacao_carteira) + 1, 1) FROM transacao_carteira AS temp),
	            '{cpf}',
	            NULL,
	            {valor},
	            '{data.ToString("yyyy-MM-dd")}'
            )";

            if (!cliente)
            {
                comando = $@"INSERT INTO transacao_carteira (cd_transacao_carteira, cd_cpf_cliente, cd_cpf_trabalhador, vl_transacao_carteira, dt_transacao_carteira)
                VALUES
                (
	                (SELECT IFNULL(MAX(cd_transacao_carteira) + 1, 1) FROM transacao_carteira AS temp),
	                NULL,
	                '{cpf}',
	                {valor},
	                '{data.ToString("yyyy-MM-dd")}'
                )'";
            }

            banco.Executar(comando);

            return Ok();
        }
        catch (Exception erro)
        {
            return BadRequest(erro.Message);
        }
        finally
        {
            banco.Desconectar();
        }
    }
}