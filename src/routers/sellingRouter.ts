import {
  addSelling,
  getSellings,
  getSelling,
  updateSelling,
  deleteSelling,
} from "@/controllers/selling/sellingController";
import { verifyToken } from "@/middlewares/token";
import { Router } from "express";

const router = Router();

router.get("/", verifyToken, getSellings);
router.get("/:id", verifyToken, getSelling);
router.post("/", addSelling);
router.patch("/:id", verifyToken, updateSelling);
router.delete("/:id", verifyToken, deleteSelling);

export { router as sellingRouter };
