using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MySql.Data;
using MySql.Data.MySqlClient;
using ZstdSharp;

public class Banco
{
    MySqlConnection conexao = null;

    public void Conectar()
    {
        if (conexao == null)
        {
            string linhaConexao = "SERVER=autorack.proxy.rlwy.net; PORT=41395; UID=root; PASSWORD=root; DATABASE=Zelo";
            conexao = new MySqlConnection(linhaConexao);

            conexao.Open();
        }
        else
        {
            throw new Exception("Banco j� conectado");
        }
    }

    public void Desconectar()
    {
        if (conexao != null)
        {
            conexao.Close();
        }
        else
        {
            throw new Exception("Banco j� desconectado");
        }
    }

    public MySqlDataReader Consultar(string comando)
    {
        try
        {
            MySqlCommand csql = new MySqlCommand(comando, conexao);
            
            return csql.ExecuteReader();
        }
        catch
        {
            throw new Exception("Erro ao consultar");
        }
    }

    public void Executar(string comando)
    {
        try
        {
            MySqlCommand csql = new MySqlCommand(comando, conexao);

            csql.ExecuteNonQuery();
        }
        catch
        {
            throw new Exception("Erro ao executar");
        }
    }
}
