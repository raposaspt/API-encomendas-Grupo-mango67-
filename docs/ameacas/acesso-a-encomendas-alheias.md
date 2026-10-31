# A-02 — Consultar encomendas de outro utilizador

**Estado:** identificada; correção e testes específicos pendentes.

**Política associada:** [PS-02 — Autorização de encomendas](../politicas/PS-02-autorizacao-encomendas.md).

## Caso de abuso

Como atacante autenticado, quero substituir o identificador de uma encomenda pelo de outro utilizador, para consultar dados que não me pertencem.

## Evidência no código atual

Em [`src/routes/encomendas.js`](../../src/routes/encomendas.js), `GET /encomendas/:id` utiliza o middleware de autenticação, mas procura a encomenda apenas pelo seu ID. Quando existe uma linha, devolve-a sem comparar `utilizadorId` com o `sub` do utilizador autenticado.

A rota de listagem `GET /encomendas` já filtra as linhas por `utilizadorId`, mas essa verificação não é aplicada à consulta individual. Uma autenticação válida, por si só, não concede acesso a todas as encomendas.

## Impacto

Um utilizador pode consultar encomendas de outras pessoas, incluindo total e estado. A sequência previsível dos identificadores facilita a tentativa de acesso a vários registos. No exercício, os registos provêm de um conjunto em memória.

## Mitigação prevista

- Limitar a consulta individual simultaneamente ao ID da encomenda e ao utilizador autenticado.
- Aplicar a regra de propriedade também à listagem e a futuras operações sobre encomendas.
- Devolver o mesmo `404` e `{"erro":"não encontrada"}` para encomendas alheias e inexistentes, sem devolver os respetivos dados.
- Obter a identidade de um token validado, nunca de um campo fornecido no corpo ou nos parâmetros do pedido.

## Critérios de aceitação

1. Com dois utilizadores e encomendas distintas, cada um consegue consultar as suas encomendas.
2. Cada listagem contém apenas encomendas do utilizador autenticado.
3. Consultar uma encomenda do outro utilizador devolve o mesmo estado e corpo que consultar uma encomenda inexistente.
4. As respostas de recusa não contêm dados da encomenda pedida.

Estes casos devem correr com `npm test`; o teste de carregamento atual não os verifica. Ver também a [política geral](../../SECURITY.md).
