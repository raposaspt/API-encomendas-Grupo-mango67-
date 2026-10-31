const test = require("node:test");
const assert = require("node:assert");
const { randomBytes } = require("node:crypto");

// Chave efémera usada apenas pelo processo de teste.
process.env.JWT_SECRET ||= randomBytes(32).toString("hex");

const app = require("../src/server");

test("a aplicação carrega", () => {
  assert.ok(app);
});
