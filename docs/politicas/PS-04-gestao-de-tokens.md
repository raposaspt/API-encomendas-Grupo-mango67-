# PS-04 — Emissão, validação e revogação de tokens

**Grupo:** mango67 · **Versão:** 0.1 · **Data:** 2026-10-31

**Estado:** proposta documentada; implementação e testes específicos pendentes.

## Âmbito

Aplica-se à emissão em [src/routes/auth.js](../../src/routes/auth.js), à validação em [src/autenticacao.js](../../src/autenticacao.js), à configuração do segredo e a todas as rotas protegidas. Detalha a regra 4 da [política geral](../../SECURITY.md) e responde à ameaça [A-04 — Uso de um token roubado](../ameacas/token-roubado.md).

## Regras

1. Emitir tokens apenas depois da autenticação exigida pela PS-01.
2. Validar a assinatura JWT e permitir explicitamente apenas o algoritmo `HS256`.
3. Exigir um `sub` válido que identifique um utilizador existente. Não confiar apenas na presença de dados descodificados do token.
4. Exigir `iat` e `exp` válidos e coerentes: `exp` posterior a `iat`, prazo máximo de 15 minutos e token ainda dentro da validade. Recusar datas inválidas e `iat` no futuro.
5. Guardar o segredo numa variável de ambiente, fora do repositório. Os logs não podem incluir tokens nem o segredo.
6. Usar HTTPS em produção para transportar credenciais e tokens.
7. Disponibilizar um mecanismo para revogar sessões comprometidas e verificar a revogação antes de autorizar pedidos protegidos.
8. Tokens ausentes, adulterados, expirados, revogados, com algoritmo diferente ou claims ausentes/inválidos devem resultar em HTTP `401`, sem dados protegidos.

## Verificação para aceitar a implementação

| Caso | Resultado exigido |
|---|---|
| Token emitido após um login válido | `HS256`, `sub` de uma conta existente e `exp - iat` não superior a 900 segundos. |
| Token ausente, adulterado, expirado ou revogado | `401`, sem acesso à rota protegida. |
| Algoritmo diferente, `sub` inexistente ou claims obrigatórios ausentes | `401`, sem acesso a dados de negócio. |
| `iat`/`exp` inválidos, invertidos, `iat` futuro ou duração superior a 15 minutos | `401`. |
| Token válido de uma sessão entretanto revogada | `401`, mesmo antes de atingir `exp`. |

Os testes de emissão, validação e revogação devem integrar `npm test`. A revisão deve também confirmar a origem do segredo, a configuração HTTPS do ambiente de produção e a ausência de tokens nos logs; o teste de carregamento não comprova estes requisitos operacionais.

## Situação observada e limite da proteção

Os tokens atuais são emitidos com validade de duas horas. O segredo está definido no código e não existe um mecanismo de revogação. A chamada de validação atual não declara uma lista de algoritmos nem verifica a existência da conta ou os claims exigidos por esta política.

Um token roubado que ainda seja válido pode ser reutilizado até expirar ou ser revogado. Validar a assinatura não distingue o titular legítimo de quem copiou esse token.

## Responsabilidades e aprovação

- **Diogo Barbosa (Autor):** mantém a regra e os critérios de aceitação.
- **Diogo Pereira (Executor):** implementa a gestão de tokens e os testes.
- **Tiago Peixoto (Revisor):** verifica os resultados e a evidência operacional.

Alterações e exceções exigem aprovação do revisor e do mantenedor `@raposaspt`, conforme `SECURITY.md`. Uma exceção deve indicar no PR o motivo, o risco e o prazo de correção.
