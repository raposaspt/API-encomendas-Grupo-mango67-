const assert = require("node:assert/strict");
const { test } = require("node:test");
const { request, token } = require("../../test-support/http");

test("PS-02: utilizador não recebe a encomenda de outra pessoa", async () => {
  const resposta = await request("/encomendas/102", {
    headers: { authorization: `Bearer ${token({ sub: 1, perfil: "cliente" }, { expiresIn: "5m" })}` },
  });

  assert.equal(resposta.status, 404);
  assert.deepEqual(resposta.body, { erro: "não encontrada" });
});

test("PS-02: encomenda alheia e inexistente têm a mesma resposta", async () => {
  const authorization = `Bearer ${token({ sub: 1, perfil: "cliente" }, { expiresIn: "5m" })}`;
  const alheia = await request("/encomendas/102", { headers: { authorization } });
  const inexistente = await request("/encomendas/999", { headers: { authorization } });

  assert.deepEqual(alheia, inexistente);
});

test("PS-02: listagem contém apenas as encomendas do utilizador autenticado", async () => {
  const resposta = await request("/encomendas", {
    headers: {
      authorization: `Bearer ${token({ sub: 1, perfil: "cliente" }, { expiresIn: "5m" })}`,
    },
  });

  assert.equal(resposta.status, 200);
  assert.deepEqual(resposta.body.map((encomenda) => encomenda.id), [101]);
});
