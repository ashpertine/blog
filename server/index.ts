import { app } from "./app";
import { env } from "./config/env.ts";
const PORT: number = env.appPort;

app.listen(PORT, () => {
  console.log(`Express is listening on port: ${PORT}`);
} )