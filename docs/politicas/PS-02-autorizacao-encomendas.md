# PS-02 — Acesso às encomendas do próprio utilizador

**Grupo:** mango67 · **Versão:** 0.1 · **Data:** 2026-10-31

**Estado:** proposta documentada; implementação e testes específicos pendentes.

## Âmbito

Aplica-se a `GET /encomendas` e `GET /encomendas/:id`, em [src/routes/encomendas.js](../../src/routes/encomendas.js). Detalha a regra 2 da [política geral](../../SECURITY.md) e responde à ameaça [A-02 — Acesso a encomendas alheias](../ameacas/acesso-a-encomendas-alheias.md).

## Regras

1. Consultar ou listar encomendas exige um utilizador autenticado e validado segundo a PS-04.
2. Cada utilizador só pode receber encomendas cujo proprietário corresponda à sua identidade autenticada.
3. A consulta de uma encomenda pelo ID deve verificar também o proprietário. Conhecer o ID de uma encomenda não concede acesso.
4. Uma encomenda alheia e uma encomenda inexistente devem produzir a mesma resposta: HTTP `404`, com `{"erro":"não encontrada"}`, sem dados da encomenda nem do proprietário.
5. A listagem não pode incluir encomendas de outros utilizadores.

## Verificação para aceitar a implementação

| Caso | Resultado exigido |
|---|---|
| Utilizador A consulta uma encomenda sua | Apenas os dados dessa encomenda. |
| Utilizador B consulta uma encomenda de A | `404`, com a mensagem genérica definida acima e sem dados. |
| Utilizador autenticado consulta um ID válido inexistente | Resposta idêntica à consulta de uma encomenda alheia. |
| A e B listam as suas encomendas | Cada resposta contém apenas as encomendas do respetivo utilizador. |
| Pedido sem autenticação válida | `401`, antes de devolver dados protegidos. |

Os testes devem usar duas contas e encomendas de ambas, comparar as respostas de `404` e integrar `npm test`.

## Situação observada

A consulta individual atual seleciona a encomenda pelo ID e devolve-a sem verificar o proprietário. A listagem aplica um filtro em memória por `utilizadorId`; esse filtro não protege a rota individual. Ainda não existem testes próprios destes limites de acesso.

## Responsabilidades e aprovação

- **Diogo Barbosa (Autor):** mantém a regra e os critérios de aceitação.
- **Diogo Pereira (Executor):** implementa a autorização e os testes.
- **Tiago Peixoto (Revisor):** verifica os acessos permitidos e recusados.

Alterações e exceções exigem aprovação do revisor e do mantenedor `@raposaspt`, conforme `SECURITY.md`. Uma exceção deve indicar no PR o motivo, o risco e o prazo de correção.
