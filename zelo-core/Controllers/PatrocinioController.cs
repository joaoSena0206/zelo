using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("Patrocinio")]
public class PatrocinioController : ControllerBase
{
    [HttpGet("CarregarPatrocinados")]
    public IActionResult CarregarPatrocinados()
    {
        try
        {
            Banco banco = new Banco();
            banco.Conectar();

            #region Carrega os patrocinados do banco

            string comando = @"SELECT p.cd_cpf_trabalhador, nm_trabalhador, dt_cadastro_trabalhador, nm_servico, p.cd_servico FROM patrocinio p
            JOIN trabalhador t ON (p.cd_cpf_trabalhador = t.cd_cpf_trabalhador)
            JOIN servico s ON (p.cd_servico = s.cd_servico)
            GROUP BY p.cd_cpf_trabalhador LIMIT 5";
            MySqlDataReader dados = banco.Consultar(comando);

            List<Patrocinio> listaPatrocinio = new List<Patrocinio>();
            TrabalhadorController trabalhadorController = new TrabalhadorController();

            if (dados != null)
            {
                while (dados.Read())
                {
                    Patrocinio patrocinio = new Patrocinio();
                    Trabalhador trabalhador = new Trabalhador();
                    Servico servico = new Servico();

                    trabalhador.Cpf = dados.GetString(0);
                    trabalhador.Nome = dados.GetString(1);
                    trabalhador.DataCadastro = dados.GetDateTime(2);
                    trabalhador.Avaliacao = trabalhadorController.PegarEstrelas(trabalhador.Cpf);

                    servico.Codigo = dados.GetInt32(4);
                    servico.Nome = dados.GetString(3);

                    patrocinio.Trabalhador = trabalhador;
                    patrocinio.Servico = servico;

                    listaPatrocinio.Add(patrocinio);
                }
            }

            dados.Close();
            banco.Desconectar();

            return Ok(listaPatrocinio);

            #endregion
        }
        catch (Exception erro)
        {
            return BadRequest(erro.Message);
        }


    }
}
