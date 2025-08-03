import { getUsers } from "@/controllers/user/getUsers";
import { profile } from "@/controllers/user/profile/profile";
import { Router } from "express";

const router = Router();

router.get("/", getUsers);
router.get("/profile", profile);

export { router as userRouter };
