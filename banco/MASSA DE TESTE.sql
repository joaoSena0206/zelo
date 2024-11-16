USE Zelo;

INSERT INTO trabalhador VALUES
('12345678901', 'Ana Silva', '1990-05-15', '2023-01-01', 'ana.silva@example.com', md5('senha123'), 'pix-ana', TRUE, TRUE, 50.00, -23.550520, -46.633308, ""),
('23456789012', 'Bruno Santos', '1985-08-22', '2023-02-10', 'bruno.santos@example.com', md5('senha456'), 'pix-bruno', TRUE, FALSE, 75.00, -22.906847, -43.172896, ""),
('34567890123', 'Carla Oliveira', '1992-12-30', '2023-03-15', 'carla.oliveira@example.com', md5('senha789'), 'pix-carla', FALSE, TRUE, 60.00, -30.034647, -51.217658, ""),
('45678901234', 'David Pereira', '1988-04-10', '2023-04-20', 'david.pereira@example.com', md5('senha012'), 'pix-david', TRUE, TRUE, 45.00, -15.780148, -47.929220, ""),
('56789012345', 'Eliana Costa', '1995-11-05', '2023-05-30', 'eliana.costa@example.com', md5('senha345'), 'pix-eliana', FALSE, FALSE, 30.00, -12.971399, -38.501305, ""),
('67890123456', 'Fernando Lima', '1980-03-25', '2023-06-10', 'fernando.lima@example.com', md5('senha678'), 'pix-fernando', TRUE, TRUE, 90.00, -23.550520, -46.633308, ""),
('78901234567', 'Gabriela Rocha', '1997-07-14', '2023-07-25', 'gabriela.rocha@example.com', md5('senha901'), 'pix-gabi', TRUE, FALSE, 80.00, -3.71722, -38.5433, ""),
('53890618880', 'Marco', '2006-06-24', '2024-09-20', 'marcojuino.07@gmail.com', md5('1234'), '50082480818', TRUE, TRUE, 0.1, -23.9524, -46.3603, ""),
/* ('50082480818', 'João Sena', '2006-06-24', '2024-09-20', 'joaosena0206@gmail.com', md5('1234'), '50082480818', FALSE, TRUE, 25, -23.9738, -46.3437, ""), */
('56787654566', 'Julberto', '2006-05-24', '2021-05-20', 'julberto@gmail.com', md5('123'), 'dasdads', TRUE, TRUE, 32.65, -23.9336, -46.3221, ""),
('56787654567', 'Robson Santos', '2006-05-24', '2020-05-20', 'robsonsantos@gmail.com', md5('123'), 'dasdads', TRUE, TRUE, 25.50, -23.9560, -46.3305, "");


INSERT INTO patrocinio VALUE(
	'56787654567', 2, 2, 200, '2024-09-21'
);


INSERT INTO patrocinio VALUE(
	'56787654566', 7, 1, 100, '2024-09-20'
);

INSERT INTO servico_trabalhador (cd_cpf_trabalhador, cd_servico) VALUES
('12345678901', 1),
('23456789012', 2),
('34567890123', 3),
('45678901234', 4),
('56789012345', 5),
('67890123456', 6),
('78901234567', 7),
('53890618880', 3),
('56787654567', 3),
('56787654566', 3);
/* ('50082480818', 3); */


INSERT INTO cliente VALUES
(
	'50082480818',
	'João Sena',
	'2006-06-02',
	'joaosena0206@gmail.com',
	md5('1234'),
	true,
	""
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

INSERT INTO cliente VALUES('12345218909', 'Roberto', '2023-09-08', 'joao.silva@gmail.com', md5('Jo@1234Silva!'), 1, "");
INSERT INTO cliente VALUES('12345674322', 'Julio', '2023-09-08', 'joao.silva@gmail.com', md5('Jo@1234Silva!'), 1, "");
INSERT INTO cliente VALUES('12345678909', 'Alberto', '2023-09-08', 'joao.silva@gmail.com', md5('Jo@1234Silva!'), 1, "");
INSERT INTO cliente VALUES('12345672469', 'Fabio', '2023-09-08', 'joao.silva@gmail.com', md5('Jo@1234Silva!'), 1, "");

INSERT INTO solicitacao_servico VALUES
(
	1,
	'53890618880',
	'50082480818',
	3,
	'2024-09-24',
	'Preciso de ajuda com um vazamento na cozinha.',
	'Serviço excelente, voltarei a chamar!',
	3.0,
	'Bom trabalho, mas a comunicação pode melhorar.',
	4.0,
	'97364'
),
(
	2,
	'53890618880',
	'50082480818',
	3,
	'2024-09-22',
	'Meu chuveiro está com problemas, não está aquecendo!',
	'Profissional muito atencioso e competente.',
	5.0,
	'Ótimo trabalho, muito satisfeito!',
	4.0,
	'63272'
),
(
	3,
	'53890618880',
	'50082480818',
	3,
	'2024-09-25',
	'O encanamento está fazendo barulho, pode vir olhar?',
	'Resolveu o problema rapidamente, recomendo!',
	4.0,
	'Serviço bom, mas poderia ser mais rápido.',
	3.0,
	'64739'
),
(
	4,
	'53890618880',
	'50082480818',
	3,
	'2024-09-26',
	'A torneira da sala está pingando, preciso de ajuda.',
	'Ótimo trabalho, muito satisfeito!',
	1.0,
	'Ótimo serviço, recomendo!',
	4.0,
	'63910'
),
(
	5,
	'53890618880',
	'50082480818',
	3,
	'2024-09-27',
	'Estou com problemas na fossa, urgente!',
	'Trabalho realizado com excelência, sem reclamações.',
	5.0,
	'Sem problemas, nota dez para o profissional.',
	4.0,
	'63833'
),
(
	6,
	'53890618880',
	'50082480818',
	3,
	'2024-09-28',
	'A água da pia não está saindo, preciso de ajuda!',
	'Ótimo trabalhador, muito eficiente!',
	2.0,
	'Profissional educado e simpático, gostei muito.',
	5.0,
	'67565'
);


INSERT INTO img_solicitacao VALUES
(
	1,
	1,
	'.png'
);
INSERT INTO img_solicitacao VALUES
(
	1,
	2,
	'.png'
);
INSERT INTO img_solicitacao VALUES
(
	1,
	3,
	'.png'
);

INSERT INTO img_solicitacao VALUES
(
	1,
	4,
	'.png'
);

INSERT INTO img_solicitacao VALUES
(
	1,
	5,
	'.png'
);

INSERT INTO img_solicitacao VALUES
(
	1,
	6,
	'.png'
);