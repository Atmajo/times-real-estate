import { Router } from "express";
import { addQuery } from "@/controllers/agent/query/addQuery";
import { getQueries } from "@/controllers/agent/query/getQueries";

const router = Router();

router.get("/query", getQueries);
router.post("/query", addQuery);

export { router as agentRouter };
