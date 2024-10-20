using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

[ApiController]
[Route("Servico")]
public class ServicoController: ControllerBase
{
    [HttpGet("CarregarServicos")]
    public List<Servico> CarregarServicos()
    {
        Banco banco = new Banco();
        banco.Conectar();

        #region Carrega os serviços do banco de acordo com a categoria

        string comando = $"SELECT * FROM servico ORDER BY nm_servico";
        MySqlDataReader dados = banco.Consultar(comando);

        List<Servico> listaServico = new List<Servico>();

        if (dados != null)
        {
            while (dados.Read())
            {
                Servico servico = new Servico();
                CategoriaServico categoriaServico = new CategoriaServico();

                categoriaServico.Codigo = dados.GetInt32(1);

                servico.Codigo = dados.GetInt32(0);
                servico.Categoria = categoriaServico;
                servico.Nome = dados.GetString(2);

                listaServico.Add(servico);
            }
        }

        dados.Close();
        banco.Desconectar();

        return listaServico;

        #endregion
    }
}
