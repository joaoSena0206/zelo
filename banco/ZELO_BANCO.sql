DROP SCHEMA IF EXISTS Zelo;
CREATE SCHEMA Zelo;
USE Zelo;


-- TABELA DO SERVIÇO --
CREATE TABLE servico
(
	cd_servico INT,
	nm_servico VARCHAR(50),

	CONSTRAINT pk_servico PRIMARY KEY (cd_servico)
);
Insert into servico values (1, 'encanador');

-- TABELA DO TRABALHADOR --
Create Table trabalhador
(
	cd_cpf_trabalhador CHAR(11),
	nm_trabalhador VARCHAR(100),
	dt_nascimento_trabalhador DATE,
	nm_email_trabalhador VARCHAR(30),
	nm_senha_trabalhador VARCHAR(255),
	nm_pix_trabalhador VARCHAR(255),
	ic_disponivel_trabalhador BOOL,

	CONSTRAINT pk_trabalhador PRIMARY KEY (cd_cpf_trabalhador)
);

Insert into trabalhador value('535305697', 'Breno Felix de Olivieira', '2006-06-24','brenofelixdeolivera@gmail.com', '1234', 'brenofelixdeolivera@gmail.com', true);

-- LIGAÇÃO TABELA SERVICO TRABALHADOR --
Create Table servico_trabalhador
(
	cd_cpf_trabalhador CHAR(11),
	cd_servico INT,
	vl_visita_trabalhador NUMERIC,

	CONSTRAINT fk_trabalhador FOREIGN KEY (cd_cpf_trabalhador) REFERENCES trabalhador(cd_cpf_trabalhador),
	CONSTRAINT fk_servico FOREIGN KEY (cd_servico) REFERENCES servico(cd_servico)
);
Insert into servico_trabalhador values('535305697', 1, 25);

-- TABELA CLIENTE --
Create Table cliente
(
	cd_cpf_cliente CHAR(11),
	nm_cliente VARCHAR(100),
	dt_nascimento_cliente DATE,
	nm_email_cliente VARCHAR(30),
	nm_senha_cliente VARCHAR(255),

	CONSTRAINT pk_cliente PRIMARY KEY (cd_cpf_cliente)
);

insert into cliente values ('525305698', 'Marco', '2006-05-24', 'marcojuino@gmail.com', md5('1234'));
insert into cliente values ('50082480818', 'Marco', '2006-05-24', 'joaosena0206@gmail.com', md5('1234'));


CREATE TABLE confirmacao
(
	cd_confirmacao INT,
	cd_cpf_cliente CHAR(11),
	cd_cpf_trabalhador CHAR(11),
	nm_codigo_confirmacao CHAR(5),

	CONSTRAINT pk_confirmacao PRIMARY KEY (cd_confirmacao),
	CONSTRAINT fk_confirmacao_cliente FOREIGN KEY (cd_cpf_cliente) REFERENCES cliente(cd_cpf_cliente),
	CONSTRAINT fk_confirmacao_trabalhador FOREIGN KEY (cd_cpf_trabalhador) REFERENCES trabalhador(cd_cpf_trabalhador)
);


-- LIGAÇÃO TABELA SERVICO CLIENTE --
Create Table solicitacao_servico
(
	cd_solicitacao_servico INT,
	cd_cpf_trabalhador CHAR(11),
	cd_cpf_cliente CHAR(11),
	dt_solicitacao_servico DATE,
	ds_servico TEXT,
	ds_comentario_avaliacao_servico TEXT,
	qt_estrelas_avaliacao_servico INT,
	ds_comentario_avaliacao_cliente TEXT,
	qt_estrelas_avaliacao_cliente INT,

    CONSTRAINT pk_solicitacao_servico PRIMARY KEY (cd_solicitacao_servico),
    CONSTRAINT fk_solicitacao_servico_trabalhador FOREIGN KEY (cd_cpf_trabalhador) REFERENCES trabalhador(cd_cpf_trabalhador),
    CONSTRAINT fk_solicitacao_servico_cliente FOREIGN KEY (cd_cpf_cliente) REFERENCES cliente(cd_cpf_cliente)
);
Insert into solicitacao_servico values(10, '535305697', '525305698', 20/04/2024, 'Cano da pia está quebrado!', 'Excelente,bem feito.', 4, 'Muito simpático.', 5); 

-- TABELA ENDERECO CLIENTE --
Create Table endereco
(
	cd_endereco INT,
	nm_identificacao_endereco VARCHAR(80),
	cd_endereco_cep CHAR(8),
	cd_cpf_cliente CHAR(11),
	cd_numero_endereco INT,
	ds_complemento_endereco TEXT,
	nm_referencia_endereco VARCHAR(255),

	CONSTRAINT fk_endereco_cpf_cliente FOREIGN KEY (cd_cpf_cliente) REFERENCES cliente(cd_cpf_cliente),
	CONSTRAINT pk_servico_trabalhador_servico PRIMARY KEY (cd_endereco)
);

Insert into endereco values(1, '1111-000',525305698, 7, 'Perto do Petz', true); 

-- TABELA CERTIFICADO TRABALHADOR -- 
Create table certificado
(
	cd_certificado INT,
	cd_cpf_trabalhador CHAR(11),
	nm_certificado VARCHAR(100),

	CONSTRAINT pk_certificado PRIMARY KEY (cd_certificado),
	CONSTRAINT fk_certificado_trabalhador FOREIGN KEY (cd_cpf_trabalhador) REFERENCES trabalhador(cd_cpf_trabalhador)
);

Insert into certificado values(1, '535305697', 'Certificado encanador ETECAF');