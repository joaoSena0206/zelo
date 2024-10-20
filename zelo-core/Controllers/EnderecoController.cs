using MySql.Data.MySqlClient;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

[ApiController]
[Route("Endereco")]
public class EnderecoController : ControllerBase
{
    [HttpPost("AdicionarEndereco")]
    public IActionResult AdicionarEndereco()
    {
        Banco banco = new Banco();
        banco.Conectar();

        try
        {
            Endereco endereco = JsonSerializer.Deserialize<Endereco>(Request.Form["endereco"]);

            #region Adiciona o endereço no banco

            string comando = $@"INSERT INTO endereco VALUES 
            (
	            (SELECT IFNULL(MAX(cd_endereco) + 1, 1) FROM (SELECT cd_endereco FROM endereco) AS temp),
	            '{endereco.Cep}',
	            '{endereco.Identificacao}',
	            '{endereco.CpfCliente}',
	            {endereco.Numero},
	            '{endereco.Complemento}',
	            '{endereco.Referencia}'
            );";
            banco.Executar(comando);

            return Ok();
            #endregion
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

    [HttpGet("CarregarEndereco")]
    public IActionResult CarregarEndereco([FromQuery]string cpf)
    {
        Banco banco = new Banco();
        banco.Conectar();
        try
        {

            string comando = $"SELECT * FROM endereco WHERE cd_cpf_cliente = '{cpf}'";
            MySqlDataReader dados = banco.Consultar(comando);

            Endereco endereco = new Endereco();

            if (dados != null && dados.Read())
            {
                endereco.Codigo = dados.GetInt32(0);
                endereco.Cep = dados.GetString(1);
                endereco.Identificacao = dados.GetString(2);
                endereco.Numero = dados.GetInt32(4);
                endereco.Complemento = dados.GetString(5);
                endereco.Referencia = dados.GetString(6);
            }

            dados.Close();

            return Ok(endereco);
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
