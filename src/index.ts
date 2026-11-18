import express from "express";
import type { Express } from "express";
import { env } from "./config/env";
import workoutRouter, { recordRouter } from "./routes/v1/routes";
import { apiKeyMiddleware } from "./middlewares/auth";
import { globalErrorHandler } from "./middlewares/errorHandler";
import { swaggerDocs } from "./routes/v1/swagger";
import { initDb } from "./database/mariadb";
import cors from "cors";

const port = env.port;
const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(apiKeyMiddleware);

app.use("/api/v1/workouts", workoutRouter);
app.use("/api/v1/records", recordRouter);

app.use(globalErrorHandler);

async function startServer() {
  try {
    await initDb();
    app.listen(port, () => {
      console.log(`Servidor ejecutandose en el puerto (${port})`);
      swaggerDocs(app, port);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
}

startServer();

export { app };
export default app;
