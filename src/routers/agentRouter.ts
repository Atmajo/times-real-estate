import { Router } from "express";
import { addQuery } from "@/controllers/agent/query/addQuery";
import { getQueries } from "@/controllers/agent/query/getQueries";
import { verifyToken } from "@/middlewares/token";

const router = Router();

router.get("/query", verifyToken, getQueries);
router.post("/query", addQuery);

export { router as agentRouter };
