const assert = require("node:assert/strict");
const { test } = require("node:test");
const { request, token } = require("../../test-support/http");

function authorization(value) {
  return { headers: { authorization: `Bearer ${value}` } };
}

test("PS-04: aceita apenas tokens assinados com HS256", async () => {
  const tokenComOutroAlgoritmo = token(
    { sub: 1, perfil: "cliente" },
    { algorithm: "HS384", expiresIn: "5m" }
  );
  const resposta = await request("/utilizadores/me", authorization(tokenComOutroAlgoritmo));

  assert.equal(resposta.status, 401);
});

test("PS-04: token sem sub ou exp é recusado", async () => {
  const tokenSemClaims = token({ perfil: "cliente" });
  const resposta = await request("/encomendas", authorization(tokenSemClaims));

  assert.equal(resposta.status, 401);
});

test("PS-04: token com validade superior a 15 minutos é recusado", async () => {
  const tokenLongo = token(
    { sub: 1, perfil: "cliente" },
    { expiresIn: 901 }
  );
  const resposta = await request("/utilizadores/me", authorization(tokenLongo));

  assert.equal(resposta.status, 401);
});

test("PS-04: token com iat no futuro é recusado", async () => {
  const agora = Math.floor(Date.now() / 1000);
  const tokenFuturo = token({ sub: 1, perfil: "cliente", iat: agora + 60, exp: agora + 300 });
  const resposta = await request("/utilizadores/me", authorization(tokenFuturo));

  assert.equal(resposta.status, 401);
});

test("PS-04: token de utilizador inexistente é recusado", async () => {
  const tokenSemConta = token({ sub: 999, perfil: "cliente" }, { expiresIn: "5m" });
  const resposta = await request("/utilizadores/me", authorization(tokenSemConta));

  assert.equal(resposta.status, 401);
});
