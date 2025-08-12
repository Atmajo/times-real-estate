import { profile } from "@/controllers/admin/profile/profile";
import { updateProfile } from "@/controllers/admin/profile/updateProfile";
import { Router } from "express";

const router = Router();

router.get("/profile/:adminId", profile);
router.patch("/profile/:adminId", updateProfile);

export { router as adminRouter };
