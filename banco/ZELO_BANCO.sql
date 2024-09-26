DROP SCHEMA IF EXISTS Zelo;
CREATE SCHEMA Zelo;
USE Zelo;


CREATE TABLE categoria_servico
(
	cd_categoria_servico INT,
	nm_categoria_servico VARCHAR(255),

	CONSTRAINT pk_categoria_servico PRIMARY KEY (cd_categoria_servico)
);

-- TABELA DO SERVIÇO --
CREATE TABLE servico
(
	cd_servico INT,
	cd_categoria_servico INT,
	nm_servico VARCHAR(50),

	CONSTRAINT pk_servico PRIMARY KEY (cd_servico),
	CONSTRAINT fk_servico_categoria_servico FOREIGN KEY (cd_categoria_servico) REFERENCES categoria_servico(cd_categoria_servico)
);



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
	vl_visita_trabalhador DECIMAL(5, 2),

	CONSTRAINT pk_trabalhador PRIMARY KEY (cd_cpf_trabalhador)
);



CREATE TABLE patrocinio
(	
	cd_cpf_trabalhador CHAR(11),
	cd_servico INT,
	qt_semanas_patrocinado INT,
	vl_patrocinio DECIMAL,
	dt_adesao_patrocinio DATE,

	CONSTRAINT pk_patrocinio PRIMARY KEY (cd_cpf_trabalhador, cd_servico),
	CONSTRAINT fk_patrocinio_trabalhador FOREIGN KEY (cd_cpf_trabalhador) REFERENCES trabalhador(cd_cpf_trabalhador),
	CONSTRAINT fk_patrocinio_servico FOREIGN KEY (cd_servico) REFERENCES servico(cd_servico)
);



-- LIGAÇÃO TABELA SERVICO TRABALHADOR --
Create Table servico_trabalhador
(
	cd_cpf_trabalhador CHAR(11),
	cd_servico INT,

	CONSTRAINT fk_trabalhador FOREIGN KEY (cd_cpf_trabalhador) REFERENCES trabalhador(cd_cpf_trabalhador),
	CONSTRAINT fk_servico FOREIGN KEY (cd_servico) REFERENCES servico(cd_servico)
);



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
	cd_servico INT,
	dt_solicitacao_servico DATE,
	ds_servico TEXT,
	ds_comentario_avaliacao_servico TEXT,
	qt_estrelas_avaliacao_servico DECIMAL(2, 1),
	ds_comentario_avaliacao_cliente TEXT,
	qt_estrelas_avaliacao_cliente DECIMAL(2, 1),

    CONSTRAINT pk_solicitacao_servico PRIMARY KEY (cd_solicitacao_servico),
    CONSTRAINT fk_solicitacao_servico_trabalhador FOREIGN KEY (cd_cpf_trabalhador) REFERENCES trabalhador(cd_cpf_trabalhador),
    CONSTRAINT fk_solicitacao_servico_cliente FOREIGN KEY (cd_cpf_cliente) REFERENCES cliente(cd_cpf_cliente),
	CONSTRAINT fk_solicitacao_servico_servico FOREIGN KEY (cd_servico) REFERENCES servico(cd_servico)
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