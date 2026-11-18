import { readFileSync, existsSync } from "fs";
import path from "path";

let envApiKey = process.env.API_KEY;
let envPort = process.env.PORT;
let envMariaHost = process.env.MARIADB_HOST;
let envMariaPort = process.env.MARIADB_PORT;
let envMariaUser = process.env.MARIADB_USER || process.env.MARIADB_USERNAME;
let envMariaPassword = process.env.MARIADB_PASSWORD;
let envMariaDatabase = process.env.MARIADB_DATABASE;
let envMariaSsl = process.env.MARIADB_SSL;

const envPath = path.resolve(import.meta.dirname, ".env");
if (existsSync(envPath)) {
  const content = readFileSync(envPath, "utf-8");
  const lines = content.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (key && rest.length > 0) {
      const k = key.trim();
      const val = rest.join("=").trim().replace(/^["']|["']$/g, "");
      if (k === "API_KEY" && !envApiKey) envApiKey = val;
      if (k === "PORT" && !envPort) envPort = val;
      if (k === "MARIADB_HOST" && !envMariaHost) envMariaHost = val;
      if (k === "MARIADB_PORT" && !envMariaPort) envMariaPort = val;
      if ((k === "MARIADB_USER" || k === "MARIADB_USERNAME") && !envMariaUser)
        envMariaUser = val;
      if (k === "MARIADB_PASSWORD" && !envMariaPassword)
        envMariaPassword = val;
      if (k === "MARIADB_DATABASE" && !envMariaDatabase)
        envMariaDatabase = val;
      if (k === "MARIADB_SSL" && !envMariaSsl)
        envMariaSsl = val;
    }
  }
}

export const env = {
  port: Number(envPort || 3024),
  apiKey: envApiKey || "EduApiKey",
  mariadb: {
    host: envMariaHost || "127.0.0.1",
    port: Number(envMariaPort || 3308),
    user: envMariaUser || "root",
    password: envMariaPassword || "root",
    database: envMariaDatabase || "mi_base",
    ssl: envMariaSsl === "true" || envMariaSsl === "1",
  },
};
