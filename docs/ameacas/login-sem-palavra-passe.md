# A-01 — Obter um token sem palavra-passe

**Estado:** identificada; correção e testes específicos pendentes.

**Política associada:** [PS-01 — Autenticação](../politicas/PS-01-autenticacao.md).

## Caso de abuso

Como atacante, quero obter um token indicando apenas o email de um utilizador, para aceder à API em seu nome sem conhecer a palavra-passe.

## Evidência no código atual

Em [`src/routes/auth.js`](../../src/routes/auth.js), `POST /auth/login` lê apenas `email` do corpo do pedido. A rota procura esse email no conjunto de utilizadores e, quando o encontra, emite um JWT. Não lê uma palavra-passe nem a compara com `passwordHash`.

O comentário que apresenta esta verificação como simplificada para o exercício descreve uma lacuna existente; não constitui uma validação de credenciais. A camada de dados do exercício é simulada em [`src/db.js`](../../src/db.js).

## Impacto

Quem conheça um email existente pode fazer-se passar pelo respetivo utilizador. O token obtido permite chamar as rotas protegidas e amplia o impacto das restantes falhas de autorização.

## Mitigação prevista

- Exigir email e palavra-passe e validar os respetivos tipos antes de autenticar.
- Comparar a palavra-passe com um hash válido através de uma função própria para esse fim.
- Emitir um token apenas depois de a comparação ser bem-sucedida.
- Devolver o mesmo `401` e `{"erro":"credenciais inválidas"}` para email inexistente e palavra-passe ausente ou incorreta, sem devolver credenciais nem token.

## Critérios de aceitação

1. Um login válido devolve um token para o utilizador correto.
2. Um email existente sem palavra-passe não devolve token.
3. Palavra-passe incorreta e email inexistente devolvem a mesma resposta de erro prevista na política.
4. Os testes usam hashes e credenciais de teste válidos, em vez dos hashes ilustrativos atuais.

A verificação faz parte de `npm test`. O teste de carregamento atual não cobre estes comportamentos. Ver também a [política geral](../../SECURITY.md).
