using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

[RoutePrefix("CategoriaServico")]
public class CategoriaServicoController : Controller
{
    [HttpGet]
    [Route("CarregarCategoria")]
    public List<CategoriaServico> CarregarCategoria()
    {
        Banco banco = new Banco();
        banco.Conectar();

        #region Carrega as categorias do banco

        string comando = "SELECT * FROM categoria_servico";
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

        return listaCategoria;

        #endregion
    }
}