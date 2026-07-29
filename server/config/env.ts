import "dotenv/config"

function required(env_variable: string) {
  const envValue = process.env[env_variable];
  if (envValue === undefined) {
    throw new Error(`Missing .env value: ${env_variable}`);
  }

  return envValue;
}

export const env = {
  databaseUrl: required("DATABASE_URL"),
  appPort: Number(process.env["APP_PORT"] ?? 3000),
  jwtSecretKey: required("JWT_SECRET_KEY")
}
