import "./config/module-alias";

import express, { Express, Request, Response, NextFunction } from "express";
import { indexRouter } from "@/routers";
import { authRouter } from "./routers/authRouter";
import { config } from "@/config/config";
import logger from "@/logger/logger";
import schedulePing from "./lib/cron";
import { defaultAdmin } from "./lib/defaultAdmin";

const app: Express = express();
const port = config.port;

app.use(
  express.json({
    limit: "10mb",
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
    schedulePing;
  }
  next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`Request received: ${req.method} ${req.url}`);
  next();
});

app.use("/api", indexRouter);
app.use("/auth", authRouter);

app.listen(port, async () => {
  await schedulePing.start();
  await defaultAdmin()
  logger.info(`Server is running at http://localhost:${port}`);
});
