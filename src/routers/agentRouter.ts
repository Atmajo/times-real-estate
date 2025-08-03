import { Router } from "express";
import { addQuery } from "@/controllers/agent/query/addQuery";
import { getQueries } from "@/controllers/agent/query/getQueries";
import { verifyToken } from "@/middlewares/token";
import { getAgents } from "@/controllers/agent/getAgents";
import { getQueryById } from "@/controllers/agent/query/getQueryById";
import { deleteQuery } from "@/controllers/agent/query/deleteQuery";
import { deleteAgent } from "@/controllers/agent/deleteAgent";
import { updateAgent } from "@/controllers/agent/updateAgent";

const router = Router();

// Route to Agents
router.get("/", verifyToken, getAgents);
router.patch("/", verifyToken, updateAgent);
router.delete("/:id", verifyToken, deleteAgent);

// Route to Queries
router.get("/query", verifyToken, getQueries);
router.get("/query/:id", verifyToken, getQueryById);
router.post("/query", addQuery);
router.delete("/query/:id", deleteQuery);

export { router as agentRouter };
