import { Router } from "express";
import { addQuery } from "@/controllers/agent/query/addQuery";

const router = Router();

router.post("/query", addQuery);

export { router as agentRouter };
