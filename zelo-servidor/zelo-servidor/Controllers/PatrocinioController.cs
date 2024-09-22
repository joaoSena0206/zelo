using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

public class PatrocinioController
{
    public List<Patrocinio> CarregarPatrocinados()
    {
        Banco banco = new Banco();
        banco.Conectar();

        #region Carrega os patrocinados do banco

        string comando = @"SELECT p.cd_cpf_trabalhador, nm_trabalhador, dt_cadastro_trabalhador, nm_servico FROM patrocinio p
        JOIN trabalhador t ON (p.cd_cpf_trabalhador = t.cd_cpf_trabalhador)
        JOIN servico_trabalhador st ON (t.cd_cpf_trabalhador = st.cd_cpf_trabalhador)
        JOIN servico s ON (st.cd_servico = s.cd_servico)
        GROUP BY p.cd_cpf_trabalhador";
        MySqlDataReader dados = banco.Consultar(comando);

        List<Patrocinio> listaPatrocinio = new List<Patrocinio>();

        if (dados != null)
        {
            while (dados.Read())
            {
                Patrocinio patrocinio = new Patrocinio();
                Trabalhador trabalhador = new Trabalhador();

                trabalhador.Cpf = dados.GetString(0);
                trabalhador.Nome = dados.GetString(1);
                trabalhador.DataCadastro = dados.GetDateTime(2);

                patrocinio.Trabalhador = trabalhador;
                patrocinio.Servico = dados.GetString(3);

                listaPatrocinio.Add(patrocinio);
            }
        }

        dados.Close();
        banco.Desconectar();

        return listaPatrocinio;

        #endregion
    }
}