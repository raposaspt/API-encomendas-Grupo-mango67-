# api-encomendas

API de encomendas. A camada de dados deste exercício é simulada em memória.

## Correr localmente

Usa Node.js 24 e instala as versões fixadas no lock:

```powershell
npm.cmd ci --ignore-scripts
```

Cria um `.env` local com um segredo aleatório, apenas se o ficheiro ainda não existir:

```powershell
if (-not (Test-Path -LiteralPath '.env')) {
    node -e "const fs = require('node:fs'); const secret = require('node:crypto').randomBytes(32).toString('hex'); fs.writeFileSync('.env', 'PORT=3000\nNODE_ENV=development\nJWT_SECRET=' + secret + '\n');"
}
npm.cmd run start:local
```

Se já tens um `.env`, mantém os seus valores e configura `JWT_SECRET` com um segredo aleatório de pelo menos 32 bytes. O ficheiro [.env.example](.env.example) indica os nomes das variáveis, sem incluir credenciais. O script `start:local` carrega `.env` através da opção `--env-file` do Node.js; não exige uma biblioteca adicional.

Para um ambiente que já fornece as variáveis, configura `JWT_SECRET` nesse ambiente e executa `npm start`. A API recusa arrancar se o segredo faltar, estiver vazio ou tiver menos de 32 bytes. O valor não é incluído no erro.

O segredo antigo que estava no código deve ser substituído em todas as instalações. Depois da rotação, reinicia as instâncias da API; os tokens assinados com a chave antiga deixam de ser aceites. Mantém a nova chave fora do Git e dos logs.

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/login` | Autenticação, devolve token |
| GET | `/encomendas` | Encomendas do utilizador autenticado |
| GET | `/encomendas/:id` | Uma encomenda |
| GET | `/utilizadores/me` | Perfil do utilizador autenticado |
| GET | `/saude` | Estado do serviço |

## Verificação

```powershell
npm.cmd test
npm.cmd audit --omit=dev --audit-level=high
```

Os testes geram chaves efémeras, sem precisar de credenciais reais ou de uma chave guardada no GitHub. Incluem o arranque da API com configuração válida e a recusa de segredos ausentes ou inválidos.

O [workflow de testes](.github/workflows/testes.yml) executa os testes, e o [workflow de segurança](.github/workflows/seguranca.yml) verifica dependências e segredos nos ficheiros atuais. Os parâmetros de bloqueio mantêm-se ativos.

A remoção do segredo fixo e a atualização das dependências corrigem os dois bloqueios do pipeline. As restantes regras de autenticação, autorização, validação de IDs e gestão de tokens descritas em [SECURITY.md](SECURITY.md) continuam a exigir implementação e testes próprios.
