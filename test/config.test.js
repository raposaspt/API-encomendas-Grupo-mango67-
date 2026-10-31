const test = require("node:test");
const assert = require("node:assert/strict");
const { randomBytes } = require("node:crypto");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");

const startAndCheckHealth = `
  const app = require("./src/server");
  const server = app.listen(0, "127.0.0.1", async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:" + server.address().port + "/saude",
        { headers: { Connection: "close" } }
      );
      const body = await response.json();
      process.stdout.write(JSON.stringify({ status: response.status, body }));
    } catch (error) {
      process.stderr.write(error.message);
      process.exitCode = 1;
    } finally {
      server.close();
      server.closeAllConnections();
    }
  });
  server.on("error", (error) => {
    process.stderr.write(error.message);
    process.exitCode = 1;
  });
`;

function runApplication(secret) {
  const env = { ...process.env, NODE_ENV: "test" };
  delete env.JWT_SECRET;
  delete env.NODE_OPTIONS;
  if (secret !== undefined) {
    env.JWT_SECRET = secret;
  }

  return spawnSync(process.execPath, ["-e", startAndCheckHealth], {
    cwd: projectRoot,
    env,
    encoding: "utf8",
    timeout: 10000,
    windowsHide: true,
  });
}

const invalidSecrets = [
  { name: "ausente", value: undefined },
  { name: "vazio", value: "" },
  { name: "composto apenas por espaços", value: " ".repeat(64) },
  { name: "demasiado curto", value: randomBytes(15).toString("hex") },
];

for (const { name, value } of invalidSecrets) {
  test(`a aplicação recusa arrancar com JWT_SECRET ${name}`, () => {
    const result = runApplication(value);

    assert.equal(result.error, undefined, "o processo deve terminar sem timeout");
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /JWT_SECRET/);
    assert.equal(result.stdout, "");
    if (value && value.trim()) {
      assert.equal(
        result.stderr.includes(value),
        false,
        "a mensagem de erro não deve revelar o segredo recebido"
      );
    }
  });
}

test("a aplicação responde à saúde com um segredo configurado sem o divulgar", () => {
  const secret = randomBytes(32).toString("base64");

  const result = runApplication(secret);

  assert.equal(result.error, undefined, "o processo deve terminar sem timeout");
  assert.equal(result.status, 0);
  assert.deepEqual(JSON.parse(result.stdout), {
    status: 200,
    body: { ok: true },
  });
  assert.equal(result.stdout.includes(secret), false);
  assert.equal(result.stderr.includes(secret), false);
});
