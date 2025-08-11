import { deleteUser } from "@/controllers/user/deleteUser";
import { getUsers } from "@/controllers/user/getUsers";
import { profile } from "@/controllers/user/profile/profile";
import { updateProfile } from "@/controllers/user/profile/updateProfile";
import { Router } from "express";

const router = Router();

router.get("/", getUsers);
router.get("/profile", profile);
router.patch("/profile", updateProfile);
router.delete("/:id", deleteUser);

export { router as userRouter };
