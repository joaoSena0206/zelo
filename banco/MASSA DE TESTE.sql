USE Zelo;

SELECT * from cliente;
SELECT * from confirmacao;
SELECT nm_servico FROM servico WHERE cd_categoria_servico = 1;
SELECT * FROM servico ORDER BY nm_servico;

INSERT INTO trabalhador VALUE('56787654364', 'Julberto', '2006-05-24', '2021-05-20', 'julberto@gmail.com', md5('123'), 'dasdads', true, true);
INSERT INTO cliente VALUES('12345678909', 'João Silva', '2023-09-08', 'joao.silva@gmail.com', md5('Jo@1234Silva!'), 1);

INSERT INTO solicitacao_servico VALUES
(
    1, 
    '56787654364', 
    '12345678909', 
    '2024-08-23', 
    'Minha torneira está vazando muita água. Por favor, me ajude.', 
    'Breno resolveu um vazamento complicado em minha casa com rapidez e precisão. Ele explicou cada passo do processo e fez um trabalho limpo e eficiente. Sua atenção aos detalhes e conhecimento técnico foram impressionantes.',
    4.5, 
    'Ótimo cliente, uma pessoa muito gente boa. Me atendeu super bem.', 
    4
);

select SS.ds_servico, C.nm_cliente from solicitacao_servico SS join cliente C on(SS.cd_cpf_cliente = C.cd_cpf_cliente) where cd_cpf_trabalhador = 56787654364;

UPDATE trabalhador SET nm_pix_trabalhador = '50082480818', vl_visita_trabalhador = 25.50
WHERE cd_cpf_trabalhador = '50082480818';

SELECT IFNULL(AVG(qt_estrelas_avaliacao_servico), 5) FROM solicitacao_servico
WHERE cd_cpf_trabalhador = '50082480818';