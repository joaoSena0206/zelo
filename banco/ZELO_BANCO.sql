DROP SCHEMA IF EXISTS Zelo;
CREATE SCHEMA Zelo;
USE Zelo;


CREATE TABLE categoria_servico
(
	cd_categoria_servico INT,
	nm_categoria_servico VARCHAR(255),

	CONSTRAINT pk_categoria_servico PRIMARY KEY (cd_categoria_servico)
);

INSERT INTO categoria_servico VALUES (1, 'Reformas e reparos');


-- TABELA DO SERVIÇO --
CREATE TABLE servico
(
	cd_servico INT,
	cd_categoria_servico INT,
	nm_servico VARCHAR(50),

	CONSTRAINT pk_servico PRIMARY KEY (cd_servico),
	CONSTRAINT fk_servico_categoria_servico FOREIGN KEY (cd_categoria_servico) REFERENCES categoria_servico(cd_categoria_servico)
);

Insert into servico values (1, 1, 'Limpeza');
Insert into servico values (2, 1, 'Eletricista');
Insert into servico values (3, 1, 'Encanador');
Insert into servico values (4, 1, 'Chaveiro');
Insert into servico values (5, 1, 'Jardineiro');
Insert into servico values (6, 1, 'Marceneiro');
Insert into servico values (7, 1, 'Pintor');
Insert into servico values (8, 1, 'TEC em ar-condicionado');
Insert into servico values (9, 1, 'Manutenção de eletrodomésticos');


-- TABELA DO TRABALHADOR --
Create Table trabalhador
(
	cd_cpf_trabalhador CHAR(11),
	nm_trabalhador VARCHAR(100),
	dt_nascimento_trabalhador DATE,
	dt_cadastro_trabalhador DATE,
	nm_email_trabalhador VARCHAR(30),
	nm_senha_trabalhador VARCHAR(255),
	nm_pix_trabalhador VARCHAR(255),
	ic_disponivel_trabalhador BOOL,
	ic_email_confirmado_trabalhador BOOL,

	CONSTRAINT pk_trabalhador PRIMARY KEY (cd_cpf_trabalhador)
);

Insert into trabalhador value('535305697', 'Breno Felix de Olivieira', '2006-06-24', '2024-09-20', 'brenofelixdeolivera@gmail.com', md5('1234'), 'brenofelixdeolivera@gmail.com', true, false);
INSERT INTO trabalhador VALUE('56787654567', 'Robson Santos', '2006-05-24', '2020-05-20', 'robsonsantos@gmail.com', md5('123'), 'dasdads', true, true);
INSERT INTO trabalhador VALUE('56787654566', 'Julberto', '2006-05-24', '2021-05-20', 'julberto@gmail.com', md5('123'), 'dasdads', true, true);

CREATE TABLE patrocinio
(	
	cd_cpf_trabalhador CHAR(11),
	qt_semanas_patrocinado INT,
	vl_patrocinio DECIMAL,
	dt_adesao_patrocinio DATE,

	CONSTRAINT pk_patrocinio PRIMARY KEY (cd_cpf_trabalhador),
	CONSTRAINT fk_patrocinio_trabalhador FOREIGN KEY (cd_cpf_trabalhador) REFERENCES trabalhador(cd_cpf_trabalhador)
);

INSERT INTO patrocinio VALUE(
	'56787654567', 2, 200, '2024-09-21'
);


INSERT INTO patrocinio VALUE(
	'56787654566', 1, 100, '2024-09-20'
);

-- LIGAÇÃO TABELA SERVICO TRABALHADOR --
Create Table servico_trabalhador
(
	cd_cpf_trabalhador CHAR(11),
	cd_servico INT,
	vl_visita_trabalhador DECIMAL,

	CONSTRAINT fk_trabalhador FOREIGN KEY (cd_cpf_trabalhador) REFERENCES trabalhador(cd_cpf_trabalhador),
	CONSTRAINT fk_servico FOREIGN KEY (cd_servico) REFERENCES servico(cd_servico)
);
Insert into servico_trabalhador values('535305697', 1, 25);
Insert into servico_trabalhador values('56787654567', 2, 30.50);
Insert into servico_trabalhador values('56787654566', 7, 25);


-- TABELA CLIENTE --
Create Table cliente
(
	cd_cpf_cliente CHAR(11),
	nm_cliente VARCHAR(100),
	dt_nascimento_cliente DATE,
	nm_email_cliente VARCHAR(30),
	nm_senha_cliente VARCHAR(255),
	ic_email_confirmado_cliente BOOL,

	CONSTRAINT pk_cliente PRIMARY KEY (cd_cpf_cliente)
);




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


-- TABELA ENDERECO CLIENTE --
Create Table endereco
(
	cd_endereco INT,
	cd_cep_endereco CHAR(8),
	nm_identificacao_endereco VARCHAR(80),
	cd_cpf_cliente CHAR(11),
	cd_numero_endereco INT,
	ds_complemento_endereco TEXT,
	nm_referencia_endereco VARCHAR(255),

	CONSTRAINT pk_endereco PRIMARY KEY (cd_endereco, cd_cep_endereco),
	CONSTRAINT fk_endereco_cpf_cliente FOREIGN KEY (cd_cpf_cliente) REFERENCES cliente(cd_cpf_cliente)
);

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

