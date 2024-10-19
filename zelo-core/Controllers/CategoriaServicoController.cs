using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;

[Route("CategoriaServico")]
public class CategoriaServicoController : Controller
{
    [HttpGet("CarregarCategoria")]
    public string CarregarCategoria()
    {
        Banco banco = new Banco();
        banco.Conectar();

        #region Carrega as categorias do banco

        string comando = "SELECT * FROM categoria_servico ORDER BY nm_categoria_servico";
        MySqlDataReader dados = banco.Consultar(comando);

        List<CategoriaServico> listaCategoria = new List<CategoriaServico>();

        if (dados != null)
        {
            while (dados.Read())
            {
                CategoriaServico categoria = new CategoriaServico();
                categoria.Codigo = dados.GetInt32(0);
                categoria.Nome = dados.GetString(1);

                listaCategoria.Add(categoria);
            }
        }

        dados.Close();
        banco.Desconectar();

        return JsonConvert.SerializeObject(listaCategoria, Formatting.Indented);

        #endregion
    }
}
