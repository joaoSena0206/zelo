using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

[RoutePrefix("Clientes")]
public class Clientes : Controller
{
    [Route("teste")]
    public string Teste()
    {
        return "foi";
    }

    //[Route("Adicionar")]
    //public void Adicionar(Cliente cliente)
    //{ 
    //    Conectar();

    //    string comando = $"Insert into cliente values('{cliente.Cpf}', '{cliente.Nome}', '{cliente.Email}', '{cliente.Senha}')";
    //    Executar(comando);
    //}
}