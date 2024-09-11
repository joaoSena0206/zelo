using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;


public class EnderecoController : Controller
{
    public void AdicionarEndereco(Endereco endereco)
    {
        Banco banco = new Banco();
        banco.Conectar();

        #region Adiciona o endereço no banco

        string comando = $@"INSERT INTO endereco VALUES 
        (
	        (SELECT IFNULL(MAX(cd_endereco) + 1, 1) FROM (SELECT cd_endereco FROM endereco) AS temp),
	        '{endereco.Cep}',
	        '{endereco.Identificacao}',
	        '{endereco.CpfCliente}',
	        {endereco.Numero},
	        '{endereco.Complemento}',
	        '{endereco.Referencia}'
        );";
        banco.Executar(comando);

        #endregion 
    }
}
