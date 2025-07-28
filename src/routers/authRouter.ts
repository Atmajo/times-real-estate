import { Router } from "express";
import { login } from "@/controllers/admin/auth/login";
import { register } from "@/controllers/admin/auth/register";
import { userLogin } from "@/controllers/user/auth/login";
import { userRegister } from "@/controllers/user/auth/register";
import { updateRole } from "@/controllers/admin/role/updateRole";

const router = Router();

// Admin authentication routes
router.post("/login", login);
router.post("/register", register);

// User authentication routes
router.post("/user/login", userLogin);
router.post("/user/register", userRegister);

// Update admin-user role
router.patch("/verify/:userId", updateRole);

export { router as authRouter };
