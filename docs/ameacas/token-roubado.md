# A-04 — Reutilizar um token roubado

**Estado:** identificada; correção e testes específicos pendentes.

**Política associada:** [PS-04 — Gestão de tokens](../politicas/PS-04-gestao-de-tokens.md).

## Caso de abuso

Como atacante, quero reutilizar o token de outro utilizador, para efetuar pedidos à API com a identidade dessa pessoa.

## Evidência no código atual

[`src/routes/auth.js`](../../src/routes/auth.js) emite tokens com duração de duas horas. O middleware em [`src/autenticacao.js`](../../src/autenticacao.js) chama `jwt.verify`, mas não configura explicitamente a lista permitida de algoritmos nem verifica a existência do utilizador identificado por `sub`. Também não impõe a presença e a duração máxima dos campos `iat` e `exp`.

Não existe um mecanismo de revogação. O segredo de assinatura está no código de [`src/config.js`](../../src/config.js), em vez de ser fornecido pelo ambiente. A verificação da assinatura não impede a reutilização de um token legítimo roubado.

## Impacto

Um token válido comprometido pode ser reutilizado até expirar ou ser revogado. A duração atual aumenta essa janela. A exposição do segredo de assinatura permite ainda criar tokens fraudulentos, um risco relacionado que exige retirar esse segredo do código.

## Mitigação prevista

- Aceitar apenas `HS256` e validar `sub`, `iat` e `exp`, incluindo a existência do utilizador e uma duração máxima de 15 minutos.
- Fornecer o segredo por variável de ambiente, sem valor fixo ou alternativa conhecida no repositório.
- Permitir revogar sessões comprometidas e verificar essa revogação nas rotas protegidas.
- Usar HTTPS em produção e excluir tokens e cabeçalhos de autorização dos logs.

## Critérios de aceitação

1. Um token válido, não revogado e dentro do prazo permite o acesso autorizado.
2. Tokens ausentes, adulterados, expirados ou revogados devolvem `401`.
3. Algoritmo diferente, campos ausentes ou inválidos, duração excessiva e utilizador inexistente devolvem `401`.
4. Depois da revogação, o mesmo token deixa de permitir pedidos protegidos.
5. A revisão confirma o segredo fora do código, o HTTPS no ambiente de produção e a ausência de tokens nos logs.

Os testes automatizados devem integrar `npm test`; configuração, transporte e logs precisam também de revisão no ambiente correspondente. Estas verificações ainda estão pendentes. Ver a [política geral](../../SECURITY.md).
