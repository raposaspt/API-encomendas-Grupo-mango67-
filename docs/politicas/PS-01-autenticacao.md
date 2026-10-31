# PS-01 — Autenticação com palavra-passe

**Grupo:** mango67 · **Versão:** 0.1 · **Data:** 2026-10-31

**Estado:** proposta documentada; implementação e testes específicos pendentes.

## Âmbito

Aplica-se a `POST /auth/login`, em [src/routes/auth.js](../../src/routes/auth.js). Detalha a regra 1 da [política geral](../../SECURITY.md) e responde à ameaça [A-01 — Login sem palavra-passe](../ameacas/login-sem-palavra-passe.md).

## Regras

1. Emitir um token apenas depois de validar o email e comparar a palavra-passe recebida com o hash guardado para esse utilizador.
2. Email ausente ou inexistente e palavra-passe ausente ou errada devem produzir a mesma resposta: HTTP `401`, com `{"erro":"credenciais inválidas"}`.
3. Uma tentativa rejeitada não pode devolver um token, credenciais ou dados da conta.
4. As palavras-passe devem ser guardadas como hashes adequados à verificação de palavras-passe. Não guardar nem comparar palavras-passe em texto simples.

## Verificação para aceitar a implementação

| Caso | Resultado exigido |
|---|---|
| Email e palavra-passe válidos de uma conta de teste | Token emitido após a verificação do hash; validade conforme a PS-04. |
| Email ausente ou inexistente | `401`, com a mensagem genérica definida acima e sem token. |
| Email existente, sem palavra-passe | A mesma resposta `401`, sem token. |
| Email existente, palavra-passe errada | A mesma resposta `401`, sem token. |

Os testes devem usar contas de teste com hashes válidos e comparar o código HTTP e o corpo das respostas rejeitadas. Devem integrar `npm test` antes de considerar a regra implementada.

## Situação observada

A rota atual procura a conta pelo email e emite o token sem verificar uma palavra-passe. Os hashes do conjunto de dados em memória são exemplos fictícios. O teste de carregamento existente não demonstra o cumprimento desta política.

## Responsabilidades e aprovação

- **Diogo Barbosa (Autor):** mantém a regra e os critérios de aceitação.
- **Diogo Pereira (Executor):** implementa a verificação e os testes.
- **Tiago Peixoto (Revisor):** revê o código e a evidência dos testes.

Alterações e exceções exigem aprovação do revisor e do mantenedor `@raposaspt`, conforme `SECURITY.md`. Uma exceção deve indicar no PR o motivo, o risco e o prazo de correção.
