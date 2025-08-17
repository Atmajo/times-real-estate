import "./config/module-alias";

import express, { Express, Request, Response, NextFunction } from "express";
import logger from "@/logger/logger";
import cors from "cors";
import { indexRouter } from "@/routers";
import { authRouter } from "./routers/authRouter";
import { config } from "@/config/config";
import { defaultAdmin } from "./lib/defaultAdmin";
import { initializeCronJobs } from "./lib/cron";
const session = require("express-session");
import { RedisStore } from "connect-redis";
import { redis } from "./lib/redis";

const app: Express = express();
const port = config.port;

const redisStore = new RedisStore({
  client: redis,
  prefix: "session:",
});

app.use(
  cors({
    origin: config.origin,
    credentials: true,
  })
);
app.use(
  express.json({
    limit: "10mb",
  })
);
app.use(
  session({
    store: redisStore,
    secret: config.session_secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: config.nodeenv === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    },
  })
);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof SyntaxError && "body" in error) {
    logger.error("JSON parsing error:", {
      error: error.message,
      body: req.body,
      url: req.url,
      method: req.method,
    });
    return res.status(400).json({
      error: "Invalid JSON format",
      message:
        "The request body contains malformed JSON. Please check your JSON syntax.",
    });
  }
  next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`Request received: ${req.method} ${req.url}`);
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server is running");
});

app.use("/api", indexRouter);
app.use("/auth", authRouter);

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeenv,
  });
});

app.listen(port, async () => {
  config.nodeenv !== "dev" && initializeCronJobs();
  await defaultAdmin();
  logger.info(`Server is running at http://localhost:${port}`);
});
