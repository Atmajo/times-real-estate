import { profile } from "@/controllers/user/profile/profile";
import { Router } from "express";

const router = Router();

router.get("/", profile);

export { router as userRouter };
