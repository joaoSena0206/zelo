USE Zelo;

INSERT INTO categoria_servico VALUES (1, 'Reformas e reparos');

Insert into servico values (1, 1, 'Limpeza');
Insert into servico values (2, 1, 'Eletricista');
Insert into servico values (3, 1, 'Encanador');
Insert into servico values (4, 1, 'Chaveiro');
Insert into servico values (5, 1, 'Jardineiro');
Insert into servico values (6, 1, 'Marceneiro');
Insert into servico values (7, 1, 'Pintor');
Insert into servico values (8, 1, 'TEC em ar-condicionado');
Insert into servico values (9, 1, 'Manutenção de eletrodomésticos');

Insert into trabalhador value('535305697', 'Breno Felix de Olivieira', '2006-06-24', '2024-09-20', 'brenofelixdeolivera@gmail.com', md5('1234'), 'brenofelixdeolivera@gmail.com', true, false, 25);
INSERT INTO trabalhador VALUE('56787654567', 'Robson Santos', '2006-05-24', '2020-05-20', 'robsonsantos@gmail.com', md5('123'), 'dasdads', true, true, 25.50);
INSERT INTO trabalhador VALUE('56787654566', 'Julberto', '2006-05-24', '2021-05-20', 'julberto@gmail.com', md5('123'), 'dasdads', true, true, 32.65);
Insert into trabalhador value('50082480818', 'João Sena', '2006-06-24', '2024-09-20', 'joaosena0206@gmail.com', md5('1234'), '50082480818', false, true, 25);
INSERT INTO trabalhador VALUE('56787654364', 'Julberto', '2006-05-24', '2021-05-20', 'julberto@gmail.com', md5('123'), 'dasdads', true, true);

INSERT INTO patrocinio VALUE(
	'56787654567', 2, 200, '2024-09-21'
);


INSERT INTO patrocinio VALUE(
	'56787654566', 1, 100, '2024-09-20'
);

Insert into servico_trabalhador values('535305697', 1);
Insert into servico_trabalhador values('56787654567', 2);
Insert into servico_trabalhador values('56787654566', 7);
Insert into servico_trabalhador values('50082480818', 3);

INSERT INTO cliente VALUES('12345678909', 'João Silva', '2023-09-08', 'joao.silva@gmail.com', md5('Jo@1234Silva!'), 1);
INSERT INTO cliente VALUES
(
	'50082480818',
	'João Sena',
	'2006-06-02',
	'joaosena0206@gmail.com',
	md5('1234'),
	true
);

INSERT INTO solicitacao_servico VALUES
(
	1,
	'50082480818',
	'50082480818',
	'2024-09-24',
	'Mangueira quebrou',
	'',
	4.5,
	'Ótimo serviço, mas faltou na educação',
	4.0
);

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

Insert into trabalhador values('50082480818', 'João Sena', '2001-09-25', '2024-09-25','joaosena0206@gmail.com', md5('Joao1234@'), null, false, false, 0);