import { addPossession } from "@/controllers/possession/addPossession";
import { getPossessions, getPossession } from "@/controllers/possession/getPossessions";
import { updatePossession, deletePossession } from "@/controllers/possession/updatePossession";
import { Router } from "express";

const router = Router();

router.get("/", getPossessions);
router.get("/:id", getPossession);
router.post("/", addPossession);
router.patch("/:id", updatePossession);
router.delete("/:id", deletePossession);

export { router as possessionRouter };
