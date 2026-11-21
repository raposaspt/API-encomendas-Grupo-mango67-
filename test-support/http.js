const { randomBytes } = require("node:crypto");
const { after, before } = require("node:test");
const jwt = require("jsonwebtoken");

const secret = randomBytes(32).toString("hex");
process.env.JWT_SECRET = secret;

const app = require("../src/server");

let server;
let baseUrl;

before(async () => {
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (!server) return;
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
});

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
  let body;
  try {
    body = await response.json();
  } catch {
    body = null;
  }
  return { status: response.status, body };
}

function token(payload, options = {}) {
  return jwt.sign(payload, secret, options);
}

module.exports = { request, token };
