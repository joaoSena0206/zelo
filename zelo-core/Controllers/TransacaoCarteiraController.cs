using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

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

    [HttpGet("CarregarTransacoes")]
    public IActionResult CarregarTransacoes([FromQuery] string cpf, [FromQuery] string tipo)
    {
        Banco banco = new Banco();
        banco.Conectar();

        try
        {
            string comando = $@"
            SELECT 
	            dt_transacao_carteira,
                GROUP_CONCAT(cd_transacao_carteira) AS transacoes,
                GROUP_CONCAT(vl_transacao_carteira) AS valores FROM transacao_carteira
            WHERE cd_cpf_{tipo} = '{cpf}'
            GROUP BY dt_transacao_carteira
            ORDER BY dt_transacao_carteira DESC";
            MySqlDataReader dados = banco.Consultar(comando);

            string json = "[";

            if (dados != null)
            {
                while (dados.Read())
                {
                    json += "{'data': '" + dados.GetDateTime(0).ToString("dd/MM/yyyy") + "', 'transacao': '";
                    json += dados.GetString(2) + "'},";
                }

                json = json.Substring(0, json.Length - 1).Replace("'", "\"") + "]";
            }

            dados.Close();

            return Ok(json);
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