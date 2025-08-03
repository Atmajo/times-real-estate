import { Router } from "express";
import { addQuery } from "@/controllers/agent/query/addQuery";
import { getQueries } from "@/controllers/agent/query/getQueries";
import { verifyToken } from "@/middlewares/token";
import { getAgents } from "@/controllers/agent/getAgents";
import { getQueryById } from "@/controllers/agent/query/getQueryById";

const router = Router();

// Route to Agents
router.get("/", verifyToken, getAgents);

// Route to Queries
router.get("/query", verifyToken, getQueries);
router.get("/query/:id", verifyToken, getQueryById);
router.post("/query", addQuery);

export { router as agentRouter };
