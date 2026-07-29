import "dotenv/config"

function required(env_variable: string) {
  const envKey = process.env[env_variable];
  if(envKey === undefined) {
    throw new Error(`Missing .env value: ${env_variable}`)
  }

  return env_variable
}

export const env = {
  databaseUrl: required("DATABASE_URL"),
  appPort: Number(process.env["APP_PORT"] ?? 3000),
  jwtSecretKey: required("JWT_SECRET_KEY")
}