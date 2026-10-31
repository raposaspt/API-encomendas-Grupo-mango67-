# A-03 — Manipular identificadores e consultas

**Estado:** identificada; correção e testes específicos pendentes.

**Política associada:** [PS-03 — Validação e consultas](../politicas/PS-03-validacao-e-consultas.md).

## Caso de abuso

Como atacante, quero enviar texto ou expressões onde a API espera um identificador, para alterar a interpretação da consulta e obter resultados indevidos.

## Evidência no código atual

[`src/routes/encomendas.js`](../../src/routes/encomendas.js) concatena `req.params.id` no texto da consulta. [`src/routes/utilizadores.js`](../../src/routes/utilizadores.js) interpola `req.utilizador.sub` noutra consulta. Não existe validação que exija um inteiro positivo dentro do limite seguro de JavaScript, nem separação entre o SQL e os seus parâmetros.

Em [`src/db.js`](../../src/db.js), `query()` é uma simulação em memória: regista a string e procura nela um ID através de uma expressão regular. Pode aceitar um prefixo numérico de uma entrada malformada; quando não encontra um ID, devolve todas as linhas da tabela escolhida. A rota individual devolve depois a primeira linha desse resultado.

Este comportamento demonstra construção insegura de consultas e tratamento incorreto de entradas. Não demonstra a execução de uma injeção SQL num motor de base de dados real, porque esse motor não existe no exercício.

## Impacto

Uma entrada inválida pode ser tratada como outro identificador ou originar uma resposta com um registo indevido. Se o padrão de concatenação for transportado para uma base real, passa também a expor o projeto ao risco de injeção SQL.

## Mitigação prevista

- Validar os IDs antes de chamar a camada de dados: inteiros positivos, sem texto adicional e dentro de `Number.MAX_SAFE_INTEGER`.
- Devolver `400` para entradas inválidas, sem executar qualquer consulta.
- Usar consultas parametrizadas, enviando valores separados do texto SQL, incluindo os valores provenientes do token.
- Adaptar a camada simulada e os testes à interface parametrizada, sem interpretar dados do pedido como SQL.

## Critérios de aceitação

1. IDs válidos continuam a funcionar, sujeitos à autorização de propriedade.
2. Zero, negativos, números demasiado grandes, texto, `1abc` e `1 OR 1=1` devolvem `400`.
3. Os testes confirmam que entradas inválidas não chamam `db.query`.
4. Nos pedidos válidos, os testes observam SQL e parâmetros separados, sem concatenação de dados externos.

Estes critérios devem ser verificados com `npm test`. O teste de carregamento atual não os cobre. Ver também a [política geral](../../SECURITY.md).
