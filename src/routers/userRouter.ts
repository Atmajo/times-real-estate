import { deleteUser } from "@/controllers/user/deleteUser";
import { getUsers } from "@/controllers/user/getUsers";
import { profile } from "@/controllers/user/profile/profile";
import { Router } from "express";

const router = Router();

router.get("/", getUsers);
router.get("/profile", profile);
router.delete("/", deleteUser);

export { router as userRouter };
