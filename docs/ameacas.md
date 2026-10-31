# Modelo de ameaças — api-encomendas

**Grupo:** mango67

## Casos de abuso

Formato: «Como atacante, quero *fazer X*, para *conseguir Y*.»

1. Como atacante, quero obter um token sem fornecer uma palavra-passe válida, para aceder à API como se fosse um utilizador.
2. Como atacante, quero consultar uma encomenda através do ID de outro utilizador, para obter informações alheias.
3. Como atacante, quero reutilizar um token de outro utilizador, para agir em nome dessa pessoa.
4. Como atacante, quero introduzir valores inesperados no ID de uma encomenda, para manipular a consulta construída pela API.
5. Como atacante, quero fazer vários pedidos seguidos à API, para sobrecarregar o servidor.
6. Como atacante, quero enviar dados errados nos pedidos à API, para provocar erros.

## As quatro que não aceitamos correr

| ID | Ameaça e análise | Onde na API | Política associada |
|---|---|---|---|
| A-01 | [Obter um token sem palavra-passe](ameacas/login-sem-palavra-passe.md) | `src/routes/auth.js` | [PS-01 — Autenticação](politicas/PS-01-autenticacao.md) |
| A-02 | [Consultar encomendas de outros utilizadores](ameacas/acesso-a-encomendas-alheias.md) | `src/routes/encomendas.js` | [PS-02 — Autorização de encomendas](politicas/PS-02-autorizacao-encomendas.md) |
| A-03 | [Manipular consultas com dados do pedido ou do token](ameacas/manipulacao-de-consultas.md) | `src/routes/encomendas.js`, `src/routes/utilizadores.js`, `src/db.js` | [PS-03 — Validação e consultas](politicas/PS-03-validacao-e-consultas.md) |
| A-04 | [Reutilizar um token roubado](ameacas/token-roubado.md) | `src/autenticacao.js`, `src/routes/auth.js`, `src/config.js` | [PS-04 — Gestão de tokens](politicas/PS-04-gestao-de-tokens.md) |

As quatro ameaças estão identificadas no código atual. Os documentos descrevem as correções e os critérios de aceitação; a remoção do segredo fixo já foi implementada e testada, e as restantes correções e testes específicos continuam pendentes.

## Verificação

- [Política geral](../SECURITY.md): regras e responsabilidades da equipa.
- [Workflow de testes](../.github/workflows/testes.yml): executa `npm test`; inclui o carregamento e a configuração JWT; os testes das restantes regras continuam pendentes.
- [Workflow de segurança](../.github/workflows/seguranca.yml): verifica dependências e segredos nos ficheiros atuais. Não substitui os testes das quatro regras nem verifica todo o histórico Git.
- [Entrega](../ENTREGA.md): regista os links das execuções e dos PRs quando existirem.
