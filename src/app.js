import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { userRouter } from "./modules/users/user.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

export const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "20kb" }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/config.js", (req, res) => {
  res.type("application/javascript").send(
    `window.__APP_CONFIG__ = ${JSON.stringify({ API_BASE_URL: env.API_BASE_URL })};`
  );
});

app.use("/", userRouter);
app.use(express.static(projectRoot));

app.use(notFoundHandler);
app.use(errorHandler);
