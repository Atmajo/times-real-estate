import { Router } from "express";
import { login } from "@/controllers/auth/login";
import { register } from "@/controllers/auth/register";
import { userLogin } from "@/controllers/user/auth/login";
import { userRegister } from "@/controllers/user/auth/register";

const router = Router();

router.post("/login", login);
router.post("/user/login", userLogin);
router.post("/register", register);
router.post("/user/register", userRegister);

export { router as authRouter };
