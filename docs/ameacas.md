# Modelo de ameaças — api-encomendas

**Grupo:** mango67

## Casos de abuso

Formato: «Como atacante, quero *fazer X*, para *conseguir Y*.»

1. Como atacante, quero introduzir um token sem precisar de introduzir uma palavra passe, para conseguir aceder à API como se fosse um utilizador. 
2. Como atacante, quero consultar uma encomenda através do id de outro utilizador, para conseguir aceder a informações de outros.
3. Como atacante, quero utilizar um token de outro utilizador, para conseguir aceder à base de dados em nome dessa pessoa.
4. Como atacante, quero introduzir outros valores/dados no id de uma encomenda, para conseguir alterar/manipular consultas à base de dados.
5. Como atacante, quero fazer vários pedidos seguidos à API, para conseguir sobrecarregar o servidor.
6. Como atacante, quero enviar dados errados nos pedidos à API, para conseguir provocar erros.

## As quatro que não aceitamos correr

| # | Ameaça | Onde na API |
|---|--------|-------------|
| 1 |    Obter um token sem password    |      src/routes/auth.js       |
| 2 |    Consultar encomendas de outros utilizadores    |      src/routes/encomendas.js       |
| 3 |    Manipular consultas à base de dados    |      src/routes/encomendas.js       |
| 4 |    Utilizar um token roubado para conseguir entrar como outro utilizador    |      src/autenticacao.js       |
