﻿using MySql.Data.MySqlClient;

public class Banco
{
    MySqlConnection conexao = null;

    public void Conectar()
    {
        if (conexao == null)
        {
            string linhaConexao = "SERVER=54.207.255.97; PORT=3306; UID=root; PASSWORD=zeloroot; DATABASE=Zelo";
            conexao = new MySqlConnection(linhaConexao);

            conexao.Open();
        }
        else
        {
            throw new Exception("Banco já conectado");
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
            throw new Exception("Banco já desconectado");
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