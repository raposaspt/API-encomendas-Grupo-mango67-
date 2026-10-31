// Configuração da aplicação fornecida pelo ambiente.

const jwtSecret = process.env.JWT_SECRET;

if (
  typeof jwtSecret !== "string" ||
  jwtSecret.trim().length === 0 ||
  Buffer.byteLength(jwtSecret, "utf8") < 32
) {
  throw new Error("Define JWT_SECRET com pelo menos 32 bytes antes de iniciar a API.");
}

const config = {
  porta: process.env.PORT || 3000,
  ambiente: process.env.NODE_ENV || "development",
  jwtSecret,
  apiKeyPagamentos: process.env.API_KEY_PAGAMENTOS,
};

module.exports = config;
