USE Zelo;

-- TABELA: Trabalhador
INSERT INTO trabalhador VALUES
('12345678901', 'Ana Silva', '1990-05-15', '2023-01-01', 'ana.silva@example.com', md5('senha123'), 'pix-ana', TRUE, TRUE, 50.00, -23.550520, -46.633308, ""),
('23456789012', 'Bruno Santos', '1985-08-22', '2023-02-10', 'bruno.santos@example.com', md5('senha456'), 'pix-bruno', TRUE, FALSE, 75.00, -22.906847, -43.172896, ""),
('34567890123', 'Carla Oliveira', '1992-12-30', '2023-03-15', 'carla.oliveira@example.com', md5('senha789'), 'pix-carla', FALSE, TRUE, 60.00, -30.034647, -51.217658, ""),
('45678901234', 'David Pereira', '1988-04-10', '2023-04-20', 'david.pereira@example.com', md5('senha012'), 'pix-david', TRUE, TRUE, 45.00, -15.780148, -47.929220, ""),
('56789012345', 'Eliana Costa', '1995-11-05', '2023-05-30', 'eliana.costa@example.com', md5('senha345'), 'pix-eliana', FALSE, FALSE, 30.00, -12.971399, -38.501305, ""),
('67890123456', 'Fernando Lima', '1980-03-25', '2023-06-10', 'fernando.lima@example.com', md5('senha678'), 'pix-fernando', TRUE, TRUE, 90.00, -23.550520, -46.633308, ""),
('78901234567', 'Gabriela Rocha', '1997-07-14', '2023-07-25', 'gabriela.rocha@example.com', md5('senha901'), 'pix-gabi', TRUE, FALSE, 80.00, -3.71722, -38.5433, ""),
('53890618880', 'Marco Juino', '2006-06-24', '2024-09-20', 'marcojuino.07@gmail.com', md5('1234'), 'pix-marco', TRUE, TRUE, 0.1, -23.9524, -46.3603, ""),
('50082480818', 'João Sena', '2006-06-24', '2024-09-20', 'joaosena0206@gmail.com', md5('1234'), 'pix-joao', TRUE, TRUE, 0.1, -23.9738, -46.3437, ""),
('56787654566', 'Julberto', '2006-05-24', '2021-05-20', 'julberto@gmail.com', md5('123'), 'pix-julberto', TRUE, TRUE, 32.65, -23.9336, -46.3221, ""),
('56787654567', 'Robson Santos', '2006-05-24', '2020-05-20', 'robsonsantos@gmail.com', md5('123'), 'pix-robson', TRUE, TRUE, 25.50, -23.9560, -46.3305, "");

INSERT INTO transacao_carteira (cd_transacao_carteira, cd_cpf_cliente, cd_cpf_trabalhador, vl_transacao_carteira, dt_transacao_carteira)
VALUES
(31, NULL, '53890618880', 50.00, '2024-10-01'),
(32, NULL, '53890618880', -20.00, '2024-10-05'),
(33, NULL, '53890618880', 30.00, '2024-10-10'),
(34, NULL, '53890618880', -10.00, '2024-10-15');

INSERT INTO transacao_carteira (cd_transacao_carteira, cd_cpf_cliente, cd_cpf_trabalhador, vl_transacao_carteira, dt_transacao_carteira)
VALUES
(35, NULL, '50082480818', 25.92, '2024-11-01'),
(36, NULL, '50082480818', -5.00, '2024-11-05'),
(37, NULL, '50082480818', 10.00, '2024-11-10'),
(38, NULL, '50082480818', -15.00, '2024-11-15');

-- TABELA: Patrocinio
INSERT INTO patrocinio VALUES
('56787654567', 2, 2, 200, '2024-09-21'),
('56787654566', 7, 1, 100, '2024-09-20');

-- TABELA: Serviço-Trabalhador
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
('56787654566', 3),
('50082480818', 3);

-- TABELA: Cliente
INSERT INTO cliente VALUES
('50082480818', 'João Sena', '2006-06-02', 'joaosena0206@gmail.com', md5('1234'), true, ""),
('12345218909', 'Roberto', '2003-05-08', 'roberto@gmail.com', md5('Roberto1234!'), true, ""),
('12345674322', 'Julio', '2000-01-08', 'julio@gmail.com', md5('JulioSenha!'), true, ""),
('12345678909', 'Alberto', '1998-09-08', 'alberto@gmail.com', md5('Alberto5678!'), true, ""),
('12345672469', 'Fabio', '1995-04-08', 'fabio@gmail.com', md5('Fabio2022!'), true, "");


-- TABELA: Transações da Carteira
INSERT INTO transacao_carteira (cd_transacao_carteira, cd_cpf_cliente, cd_cpf_trabalhador, vl_transacao_carteira, dt_transacao_carteira)
VALUES
(11, '50082480818', NULL, 50.00, '2024-01-03'),
(12, '50082480818', NULL, -20.00, '2024-01-04'),
(13, '50082480818', NULL, 70.00, '2024-01-05'),
(14, '50082480818', NULL, 60.00, '2024-01-05');

INSERT INTO transacao_carteira (cd_transacao_carteira, cd_cpf_cliente, cd_cpf_trabalhador, vl_transacao_carteira, dt_transacao_carteira)
VALUES
(15, '12345218909', NULL, 200.00, '2024-01-06'),
(16, '12345218909', NULL, -50.00, '2024-01-07'),
(17, '12345218909', NULL, -25.00, '2024-01-08'),
(18, '12345218909', NULL, 100.00, '2024-01-09');

INSERT INTO transacao_carteira (cd_transacao_carteira, cd_cpf_cliente, cd_cpf_trabalhador, vl_transacao_carteira, dt_transacao_carteira)
VALUES
(19, '12345674322', NULL, 300.00, '2024-01-10'),
(20, '12345674322', NULL, -150.00, '2024-01-11'),
(21, '12345674322', NULL, -50.00, '2024-01-12');

INSERT INTO transacao_carteira (cd_transacao_carteira, cd_cpf_cliente, cd_cpf_trabalhador, vl_transacao_carteira, dt_transacao_carteira)
VALUES
(22, '12345678909', NULL, 80.00, '2024-01-13'),
(23, '12345678909', NULL, -30.00, '2024-01-14'),
(24, '12345678909', NULL, 70.00, '2024-01-15'),
(25, '12345678909', NULL, -20.00, '2024-01-16');

INSERT INTO transacao_carteira (cd_transacao_carteira, cd_cpf_cliente, cd_cpf_trabalhador, vl_transacao_carteira, dt_transacao_carteira)
VALUES
(26, '12345672469', NULL, 60.00, '2024-01-17'),
(27, '12345672469', NULL, -25.00, '2024-01-18'),
(28, '12345672469', NULL, 40.00, '2024-01-19'),
(29, '12345672469', NULL, -15.00, '2024-01-20'),
(30, '12345672469', NULL, 50.00, '2024-01-21');


-- TABELA: Endereco
INSERT INTO endereco VALUES
(1, '11075540', 'Casa', '50082480818', '7', '', 'Estádio Caldeira'),
(2, '11065400', 'Apartamento', '12345218909', '12A', '', 'Condomínio Central'),
(3, '11087230', 'Casa', '12345674322', '23', '', 'Bairro Nova Esperança'),
(4, '11043100', 'Apartamento', '12345678909', '8B', '', 'Residencial Porto'),
(5, '11091240', 'Comercial', '12345672469', '45', '', 'Prédio Empresarial Sul');

-- TABELA: Favoritos
INSERT INTO favoritos (cd_cpf_cliente, cd_cpf_trabalhador)
VALUES
('50082480818', '53890618880'),
('50082480818', '56787654567'),
('50082480818', '50082480818'),
('50082480818', '78901234567'),
('50082480818', '56789012345'),
('50082480818', '34567890123');

-- TABELA: Solicitacao_Servico
INSERT INTO solicitacao_servico VALUES
(1, '53890618880', '50082480818', 3, '2024-09-24', 'Preciso de ajuda com um vazamento na cozinha.', 'Serviço excelente, voltarei a chamar!', 5.0, 'Bom trabalho, mas a comunicação pode melhorar.', 4.0, '97364'),
(2, '53890618880', '12345218909', 4, '2024-09-22', 'Minha pia está entupida, pode resolver?', 'Muito eficiente e rápido!', 5.0, 'Recomendo o profissional.', 5.0, '63272'),
(3, '53890618880', '12345674322', 5, '2024-09-25', 'A torneira está pingando, preciso de reparo.', 'Resolveu o problema de forma prática.', 4.0, 'Serviço satisfatório.', 4.0, '64739'),
(4, '53890618880', '12345678909', 6, '2024-09-26', 'O chuveiro não está funcionando.', 'Profissional competente!', 5.0, 'Sem reclamações.', 5.0, '63910'),
(5, '53890618880', '12345672469', 7, '2024-09-27', 'Estou com problema no encanamento da loja.', 'Ótimo trabalho realizado.', 5.0, 'Sem problemas, excelente atendimento.', 5.0, '63833'),
(6, '53890618880', '50082480818', 8, '2024-09-28', 'A água da pia não está saindo, preciso de ajuda!', 'Ótimo trabalhador, muito eficiente!', 5.0, 'Profissional educado e simpático, gostei muito.', 5.0, '67565');

INSERT INTO solicitacao_servico VALUES
(7, '12345678901', '50082480818', 4, '2024-10-01', 'Estou com uma infiltração no teto da cozinha que parece vir do encanamento. Preciso resolver com urgência.', 'Ótimo profissional, resolveu o problema no mesmo dia.', 5.0, 'Trabalho excelente, sem reclamações.', 5.0, '87321'),
(8, '23456789012', '12345218909', 4, '2024-10-02', 'Minha máquina de lavar está vazando água no chão e preciso verificar o encanamento.', 'Serviço rápido e eficaz, muito educado.', 4.0, 'Bom trabalho, mas atrasou um pouco no horário combinado.', 4.0, '75398'),
(9, '34567890123', '12345674322', 5, '2024-10-03', 'O ar-condicionado está com um ruído estranho e não está gelando como antes.', 'Excelente serviço, tudo foi resolvido de forma profissional.', 5.0, 'Satisfeito com o resultado, recomendo!', 5.0, '98273'),
(10, '45678901234', '12345678909', 6, '2024-10-04', 'A descarga do banheiro está com vazamento contínuo e a água não para de sair.', 'Problema resolvido rapidamente, muito bom profissional.', 5.0, 'Sem queixas, atendimento impecável.', 5.0, '92831'),
(11, '56789012345', '12345672469', 7, '2024-10-05', 'Os disjuntores da caixa de força estão desarmando com frequência. Preciso de revisão elétrica.', 'Muito competente, serviço técnico de qualidade.', 5.0, 'Profissional muito atencioso, gostei bastante!', 5.0, '73492'),
(12, '67890123456', '50082480818', 8, '2024-10-12', 'Preciso instalar um novo filtro de água e revisar o encanamento da pia.', 'Trabalho feito de forma limpa e organizada.', 5.0, 'Recomendo totalmente, profissional excelente.', 5.0, '67324');

-- TABELA: Img_Solicitacao
INSERT INTO img_solicitacao VALUES
(1, 1, '.png'),
(1, 2, '.png'),
(1, 3, '.png'),
(1, 4, '.png'),
(1, 5, '.png'),
(1, 6, '.png');
