const assert = require("node:assert/strict");
const { test } = require("node:test");
const db = require("../../src/db");
const { request, token } = require("../../test-support/http");

const chamadas = [];
const queryOriginal = db.query;
db.query = (...args) => {
  chamadas.push(args);
  return queryOriginal(...args);
};

function authorization() {
  return `Bearer ${token({ sub: 1, perfil: "cliente" }, { expiresIn: "5m" })}`;
}

test("PS-03: ID parcialmente numérico é rejeitado antes da consulta", async () => {
  chamadas.length = 0;
  const resposta = await request("/encomendas/1abc", {
    headers: { authorization: authorization() },
  });

  assert.equal(resposta.status, 400);
  assert.equal(chamadas.length, 0);
});

test("PS-03: tentativa de injeção é rejeitada antes da consulta", async () => {
  chamadas.length = 0;
  const resposta = await request("/encomendas/1%20OR%201=1", {
    headers: { authorization: authorization() },
  });

  assert.equal(resposta.status, 400);
  assert.equal(chamadas.length, 0);
});

test("PS-03: ID válido é enviado como parâmetro separado do SQL", async () => {
  chamadas.length = 0;
  const resposta = await request("/encomendas/101", {
    headers: { authorization: authorization() },
  });

  assert.equal(resposta.status, 200);
  assert.equal(chamadas.length, 1);
  assert.match(chamadas[0][0], /WHERE\s+id\s*=\s*\?/i);
  assert.deepEqual(chamadas[0][1], [101]);
});
