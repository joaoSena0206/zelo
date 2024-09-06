using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;

[RoutePrefix("Clientes")]
public class ClienteController : Controller
{
    [HttpPost]
    [Route("Adicionar")]
    public string Adicionar()
    {
        Banco banco = new Banco();
        banco.Conectar();

        #region Lê o conteúdo do body e converte o JSON em um objeto Cliente

        string json;
        using (var reader = new StreamReader(Request.InputStream))
        {
            json = reader.ReadToEnd();
        }

        Cliente cliente = JsonConvert.DeserializeObject<Cliente>(json);

        #endregion

        #region Checa a existência do email e do cpf

        string comando = $"SELECT COUNT(cd_cpf_cliente) FROM cliente WHERE cd_cpf_cliente = '{cliente.Cpf}'";
        MySqlDataReader dados = banco.Consultar(comando);

        bool cpfExiste = false;
        bool emailExiste = false;

        if (dados != null)
        {
            if (dados.Read())
            {
                if (dados.GetInt32(0) >= 1)
                {
                    cpfExiste = true;
                }
            }
        }

        dados.Close();

        comando = $"SELECT COUNT(nm_email_cliente) FROM cliente WHERE nm_email_cliente = '{cliente.Email}'";
        dados = banco.Consultar(comando);

        if (dados != null)
        {
            if (dados.Read())
            {
                if (dados.GetInt32(0) >= 1)
                {
                    emailExiste = true;
                }
            }
        }

        dados.Close();

        if (cpfExiste == true)
        {
            return "Cpf já cadastrado!";
        }

        if (emailExiste == true)
        {
            return "Email já cadastrado!";
        }

        #endregion

        #region Adiciona o cliente no banco

        comando = $"Insert into cliente values('{cliente.Cpf}', '{cliente.Nome}', '{cliente.Email}', md5('{cliente.Senha}'))";
        banco.Executar(comando);

        return "ok";

        #endregion
    }
}