select S.nm_servico, F.cd_cpf_trabalhador, T.nm_trabalhador, T.vl_visita_trabalhador,
(select ROUND(AVG(SS.qt_estrelas_avaliacao_servico)) from solicitacao_servico SS) as mediaestrelas
from solicitacao_servico SS 
join trabalhador T on ( SS.cd_cpf_trabalhador = T.cd_cpf_trabalhador) 
join favoritos F on( T.cd_cpf_trabalhador = F.cd_cpf_trabalhador )
join servico_trabalhador ST on ( F.cd_cpf_trabalhador = ST.cd_cpf_trabalhador )
join servico S on ( ST.cd_servico = S.cd_servico ) where F.cd_cpf_cliente = '50082480818' and nm_codigo_aleatorio != '' order by S.nm_servico;

SELECT 
    S.nm_servico, 
    F.cd_cpf_trabalhador, 
    T.nm_trabalhador, 
    T.vl_visita_trabalhador,
    COALESCE(
        (SELECT ROUND(AVG(SS.qt_estrelas_avaliacao_servico)) 
         FROM solicitacao_servico SS 
         WHERE SS.cd_cpf_trabalhador = T.cd_cpf_trabalhador and SS.nm_codigo_aleatorio != '' ), 
        5
    ) AS mediaestrelas
FROM 
    trabalhador T
JOIN 
    favoritos F ON T.cd_cpf_trabalhador = F.cd_cpf_trabalhador
JOIN 
    servico_trabalhador ST ON F.cd_cpf_trabalhador = ST.cd_cpf_trabalhador
JOIN 
    servico S ON ST.cd_servico = S.cd_servico
WHERE 
    F.cd_cpf_cliente = '50082480818' 
ORDER BY 
    S.nm_servico;