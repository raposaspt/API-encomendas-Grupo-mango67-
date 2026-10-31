# Entrega — Grupo mango67

**Elementos:** Diogo Barbosa (Autor), Diogo Pereira (Executor), Tiago Peixoto (Revisor)

| # | Item | Onde |
|---|------|------|
| 1 | Modelo de ameaças | [docs/ameacas.md](docs/ameacas.md) |
| 2 | Política geral | [SECURITY.md](SECURITY.md) |
| 3 | Pipeline de segurança | [.github/workflows/seguranca.yml](.github/workflows/seguranca.yml) |
| 4 | Execução **VERMELHA** | [Execução com falhas de dependências e segredo](https://github.com/raposaspt/API-encomendas-Grupo-mango67-/actions/runs/41195134931) |
| 5 | Execução **VERDE** | Pendente — preencher depois das correções e de uma execução real sem falhas. |
| 6 | PR que abrimos noutro grupo | Pendente — indicar o grupo e o URL do PR real. |
| 7 | PR que revimos | Pendente — indicar o URL do PR real. |

## Documentos por ameaça

| Ameaça | Análise | Política |
|---|---|---|
| A-01 — Login sem palavra-passe | [Análise](docs/ameacas/login-sem-palavra-passe.md) | [PS-01 — Autenticação](docs/politicas/PS-01-autenticacao.md) |
| A-02 — Acesso a encomendas alheias | [Análise](docs/ameacas/acesso-a-encomendas-alheias.md) | [PS-02 — Autorização](docs/politicas/PS-02-autorizacao-encomendas.md) |
| A-03 — Manipulação de consultas | [Análise](docs/ameacas/manipulacao-de-consultas.md) | [PS-03 — Validação e consultas](docs/politicas/PS-03-validacao-e-consultas.md) |
| A-04 — Token roubado | [Análise](docs/ameacas/token-roubado.md) | [PS-04 — Gestão de tokens](docs/politicas/PS-04-gestao-de-tokens.md) |

O workflow de testes existente mantém-se em [.github/workflows/testes.yml](.github/workflows/testes.yml). Os documentos e o pipeline não constituem prova de que as vulnerabilidades da API estejam corrigidas. Só devem ser registados resultados e aprovações efetivamente obtidos.
