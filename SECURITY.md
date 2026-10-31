# Política de Segurança — api-encomendas

**Grupo:** mango67 · **Versão:** 0.1 · **Data:** 2026-10-24

## Objetivo

Impedir logins sem palavra-passe, acesso a encomendas alheias, manipulação de consultas e uso indevido de tokens, conforme o [modelo de ameaças](docs/ameacas.md).

## Âmbito

Todas as rotas de autenticação, encomendas e perfil, em todos os ramos e ambientes do projeto. A rota `/saude` pode ser pública, sem expor dados pessoais ou internos. A administração da infraestrutura e as aplicações externas ficam de fora.

## Regras

| # | Regra | Como se verifica |
|---|-------|------------------|
| 1 | Só emitir tokens após validar o email e a palavra-passe contra o hash guardado. Email inexistente ou palavra-passe errada/ausente devolvem o mesmo `401`, com `{"erro":"credenciais inválidas"}`, sem credenciais nem token. | Testar esses três casos e comparar as respostas. Confirmar que um login válido devolve um token. |
| 2 | Cada utilizador só pode consultar e listar as suas encomendas. Encomendas alheias e inexistentes devolvem o mesmo `404`, sem dados. | Com dois utilizadores, confirmar que cada um vê as suas encomendas e não consegue consultar as do outro. Comparar os dois casos de `404`. |
| 3 | Aceitar apenas IDs inteiros positivos dentro do limite seguro de JavaScript. IDs inválidos devolvem `400`, sem consultar a base de dados. Usar parâmetros nas consultas, sem concatenar dados do pedido ou do token no SQL. | Testar IDs válidos, zero, negativos, números demasiado grandes, texto, `1abc` e `1 OR 1=1`. Confirmar que entradas inválidas não geram consultas e que os parâmetros são enviados separados do SQL. |
| 4 | Validar a assinatura JWT com `HS256`, o utilizador existente em `sub` e a validade máxima de 15 minutos em `iat`/`exp`. Guardar o segredo numa variável de ambiente, fora do repositório. Usar HTTPS em produção, excluir tokens dos logs e permitir revogar sessões comprometidas. | Confirmar `401` para tokens ausentes, adulterados, expirados, revogados, com algoritmo errado, campos ausentes/inválidos ou duração excessiva. Verificar o prazo dos tokens emitidos, a configuração do segredo, o HTTPS e os logs. |

Um token roubado pode funcionar até expirar ou ser revogado, mesmo com uma assinatura válida.

## Verificação

Os testes destas regras devem correr com `npm test` (`node --test`) e passar no [workflow de testes](.github/workflows/testes.yml) antes de integrar o PR. Existem testes de carregamento e da configuração JWT. A leitura do segredo pelo ambiente está implementada; as quatro regras ainda precisam das restantes correções e dos testes funcionais correspondentes.

O [workflow de segurança](.github/workflows/seguranca.yml) acrescenta duas verificações: `npm audit --omit=dev --audit-level=high` bloqueia dependências com vulnerabilidades altas ou críticas, e Gitleaks verifica os ficheiros atuais com `.gitleaks.toml`, ocultando os valores encontrados. A análise não cobre todo o histórico Git nem prova que as regras de autenticação e autorização estejam implementadas. Os achados devem ser corrigidos, sem tornar os passos opcionais para obter um resultado verde.

## Políticas detalhadas

| Regra | Documento |
|---|---|
| 1 — Autenticação | [PS-01 — Autenticação](docs/politicas/PS-01-autenticacao.md) |
| 2 — Acesso às encomendas | [PS-02 — Autorização de encomendas](docs/politicas/PS-02-autorizacao-encomendas.md) |
| 3 — IDs e consultas | [PS-03 — Validação e consultas](docs/politicas/PS-03-validacao-e-consultas.md) |
| 4 — Tokens | [PS-04 — Gestão de tokens](docs/politicas/PS-04-gestao-de-tokens.md) |

## Responsabilidades e aprovação

- **Diogo Barbosa (Autor):** define e atualiza as regras.
- **Diogo Pereira (Executor):** implementa as regras e os testes.
- **Tiago Peixoto (Revisor):** verifica os resultados e aprova os PRs para `main`.

Alterações à política, ao pipeline ou exceções às regras exigem aprovação do revisor e do mantenedor `@raposaspt`. As exceções devem indicar o motivo, o risco e o prazo de correção no PR.

## Relato de vulnerabilidades

Usar **Security → Report a vulnerability** no GitHub, se disponível. Caso contrário, abrir uma issue apenas a pedir contacto privado a `@raposaspt` e `@tiagopeixoto2025153-lang`, sem expor a falha.

Em privado, indicar a rota e a versão afetadas, os passos para reproduzir e o impacto, sem enviar credenciais reais. Tiago Peixoto acompanha o relato e Diogo Pereira prepara a correção. Publicar os detalhes só após a correção e com o acordo de quem reportou.
