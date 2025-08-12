import { profile } from "@/controllers/admin/profile/profile";
import { Router } from "express";

const router = Router();

router.get("/profile/:adminId", profile);

export { router as adminRouter };
