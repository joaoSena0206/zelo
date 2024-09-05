using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

[RoutePrefix("Clientes")]
public class ClienteController : Controller
{
    [HttpPost]
    [Route("Adicionar")]
    public void Adicionar()
    {
        Banco banco = new Banco();
        banco.Conectar();

        string json;
        using (var reader = new StreamReader(Request.InputStream))
        {
            json = reader.ReadToEnd();
        }

        Cliente cliente = JsonConvert.DeserializeObject<Cliente>(json);

        string comando = $"Insert into cliente values('{cliente.Cpf}', '{cliente.Nome}', '{cliente.Email}', md5('{cliente.Senha}'))";
        banco.Executar(comando);
    }
}