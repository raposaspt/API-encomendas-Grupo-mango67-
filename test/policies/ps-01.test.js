const assert = require("node:assert/strict");
const { test } = require("node:test");
const { request } = require("../../test-support/http");

function resumo(resposta) {
  return {
    status: resposta.status,
    erro: resposta.body?.erro,
    tokenEmitido: typeof resposta.body?.token === "string",
  };
}

test("PS-01: email existente sem palavra-passe devolve 401 sem token", async () => {
  const resposta = await request("/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "ana@exemplo.pt" }),
  });

  assert.equal(resposta.status, 401);
  assert.deepEqual(resposta.body, { erro: "credenciais inválidas" });
  assert.equal(typeof resposta.body?.token, "undefined");
});

test("PS-01: email inexistente e palavra-passe errada recebem a mesma resposta", async () => {
  const inexistente = await request("/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "nao-existe@exemplo.pt", password: "incorreta" }),
  });
  const palavraPasseErrada = await request("/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "ana@exemplo.pt", password: "incorreta" }),
  });

  assert.deepEqual(resumo(palavraPasseErrada), resumo(inexistente));
});
