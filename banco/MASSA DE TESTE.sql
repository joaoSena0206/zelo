USE Zelo;

INSERT INTO trabalhador VALUE('56787654567', 'Robson Santos', '2006-05-24', '2020-05-20', 'robsonsantos@gmail.com', md5('123'), 'dasdads', true, true, 25.50, -23.9560, -46.3305);
INSERT INTO trabalhador VALUE('56787654566', 'Julberto', '2006-05-24', '2021-05-20', 'julberto@gmail.com', md5('123'), 'dasdads', true, true, 32.65, -23.9336, -46.3221);
Insert into trabalhador value('50082480818', 'João Sena', '2006-06-24', '2024-09-20', 'joaosena0206@gmail.com', md5('1234'), '50082480818', false, true, 25, -23.9738, -46.3437);
Insert into trabalhador value('53890618880', 'Marco', '2006-06-24', '2024-09-20', 'marcojuino.07@gmail.com', md5('1234'), '50082480818', false, true, 25, -23.9524, -46.3603);

INSERT INTO patrocinio VALUE(
	'56787654567', 2, 2, 200, '2024-09-21'
);


INSERT INTO patrocinio VALUE(
	'56787654566', 7, 1, 100, '2024-09-20'
);

Insert into servico_trabalhador values('56787654567', 2);
Insert into servico_trabalhador values('56787654566', 7);
Insert into servico_trabalhador values('50082480818', 3);

INSERT INTO cliente VALUES
(
	'50082480818',
	'João Sena',
	'2006-06-02',
	'joaosena0206@gmail.com',
	md5('1234'),
	true
);
INSERT INTO endereco VALUES
(
	1,
	'11075540',
	'Casa',
	'50082480818',
	'7',
	'',
	'Estádio Caldeira'
);

INSERT INTO cliente VALUES('12345218909', 'Roberto', '2023-09-08', 'joao.silva@gmail.com', md5('Jo@1234Silva!'), 1);
INSERT INTO cliente VALUES('12345674322', 'Julio', '2023-09-08', 'joao.silva@gmail.com', md5('Jo@1234Silva!'), 1);
INSERT INTO cliente VALUES('12345678909', 'Alberto', '2023-09-08', 'joao.silva@gmail.com', md5('Jo@1234Silva!'), 1);
INSERT INTO cliente VALUES('12345672469', 'Fabio', '2023-09-08', 'joao.silva@gmail.com', md5('Jo@1234Silva!'), 1);

INSERT INTO solicitacao_servico VALUES
(
	1,
	'53890618880',
	'50082480818',
	3,
	'2024-09-24',
	'Mangueira quebrou e nao sei o que fazer!',
	'Otimo trabalho irei chamar mais vezes',
	3.0,
	'Ótimo serviço, mas faltou na educação',
	4.0
);
INSERT INTO solicitacao_servico VALUES
(
	2,
	'53890618880',
	'50082480818',
	3,
	'2024-09-22',
	'Mangueira quebrou e estou te chamando pois tenho um compromisso urgente!',
	'Exelente profissional bem educado e simpatico',
	5.0,
	'Ótimo serviço, mas faltou na educação',
	4.0
);
INSERT INTO solicitacao_servico VALUES
(
	3,
	'53890618880',
	'50082480818',
	3,
	'2024-09-24',
	'nao sei o que aconteceu com o cano deve ter estourado!',
	'Resolveu meu problema, demorou um pouco mas valeu',
	4.0,
	'Ótimo serviço, mas faltou na educação',
	3.0
);
INSERT INTO solicitacao_servico VALUES
(
	4,
	'53890618880',
	'50082480818',
	3,
	'2024-09-24',
	'nao sei o que aconteceu com o cano deve ter estourado!',
	'Parabens',
	1.0,
	'Ótimo serviço, mas faltou na educação',
	4.0
);
INSERT INTO solicitacao_servico VALUES
(
	5,
	'53890618880',
	'50082480818',
	3,
	'2024-09-24',
	'O chuveiro não esta esqyentando por favor me ajuda!',
	'Otimo servoço ficou do jeito esperado sem reclamações',
	5.0,
	'Ótimo serviço, nota dez para o rapaz',
	4.0
);
INSERT INTO solicitacao_servico VALUES
(
	6,
	'53890618880',
	'50082480818',
	3,
	'2024-09-24',
	'Hoje acordei e estava com a torneira vazando!',
	'Otimo trabalhador sem duvidas parabens!',
	2.0,
	'Rapaz muito educado e simpatico',
	5.0
);