# PS-03 — Validação de identificadores e consultas parametrizadas

**Grupo:** mango67 · **Versão:** 0.1 · **Data:** 2026-10-31

**Estado:** proposta documentada; implementação e testes específicos pendentes.

## Âmbito

Aplica-se aos identificadores usados nas consultas de encomendas e de perfil, incluindo valores recebidos no pedido e o `sub` do token. Abrange [src/routes/encomendas.js](../../src/routes/encomendas.js), [src/routes/utilizadores.js](../../src/routes/utilizadores.js) e [src/db.js](../../src/db.js).

Detalha a regra 3 da [política geral](../../SECURITY.md) e responde à ameaça [A-03 — Manipulação de consultas](../ameacas/manipulacao-de-consultas.md).

## Regras

1. Aceitar IDs de encomenda apenas quando representem inteiros positivos dentro do limite seguro de JavaScript.
2. Rejeitar IDs inválidos com HTTP `400` antes de executar qualquer consulta. Não aceitar parcialmente uma entrada como `1abc` convertendo-a para `1`.
3. Validar também os identificadores provenientes do token. Claims inválidos devem ser recusados como autenticação inválida, segundo a PS-04, antes de consultar dados de negócio.
4. Enviar os valores como parâmetros separados do texto SQL. Não concatenar nem interpolar dados do pedido ou do token no SQL.
5. Adaptar a interface da camada de dados para receber parâmetros. A eventual adoção de uma base de dados real deve preservar esta separação.

## Verificação para aceitar a implementação

| Caso | Resultado exigido |
|---|---|
| ID inteiro positivo dentro do limite seguro | Validação aceite; aplicam-se também as regras de autorização da PS-02. |
| Zero, negativo, decimal, texto ou número acima de `Number.MAX_SAFE_INTEGER` | `400`, sem chamar a camada de dados. |
| `1abc` ou `1 OR 1=1` | `400`, sem chamar a camada de dados nem aceitar apenas o prefixo numérico. |
| ID válido usado numa consulta | Texto SQL fixo e valores separados nos argumentos enviados à camada de dados. |
| `sub` ausente ou inválido no token | `401`, sem consultar dados de negócio. |

Os testes devem observar as chamadas à camada de dados, incluindo a sua ausência nos casos inválidos, e integrar `npm test`.

## Situação observada

As rotas atuais concatenam o ID do pedido ou interpolam `sub` no SQL. A função `query()` simula consultas sobre dados em memória e interpreta texto com uma expressão regular; não executa um motor SQL real. Este exercício evidencia a construção insegura e a falta de validação, sem demonstrar a execução de uma injeção SQL numa base real.

## Responsabilidades e aprovação

- **Diogo Barbosa (Autor):** mantém a regra e os critérios de aceitação.
- **Diogo Pereira (Executor):** implementa a validação, a interface de parâmetros e os testes.
- **Tiago Peixoto (Revisor):** verifica as chamadas e as recusas antes das consultas.

Alterações e exceções exigem aprovação do revisor e do mantenedor `@raposaspt`, conforme `SECURITY.md`. Uma exceção deve indicar no PR o motivo, o risco e o prazo de correção.
