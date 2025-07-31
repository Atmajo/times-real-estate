import { Router } from "express";
import { login } from "@/controllers/admin/auth/login";
import { register } from "@/controllers/admin/auth/register";
import { userLogin } from "@/controllers/user/auth/login";
import { userRegister } from "@/controllers/user/auth/register";
import { updateRole } from "@/controllers/admin/role/updateRole";
import { verify as adminVerify } from "@/controllers/admin/verify/verify";
import { verify as userVerify } from "@/controllers/user/verify/verify";
import { reset as adminpassReset } from "@/controllers/admin/auth/reset";

const router = Router();

// Admin authentication routes
router.post("/login", login);
router.post("/register", register);

// Admin password reset route
router.post("/reset", adminpassReset);

// Admin verification route
router.post("/verify", adminVerify);

// User authentication routes
router.post("/user/login", userLogin);
router.post("/user/register", userRegister);

// User verification route
router.post("/user/verify", userVerify);

// Update admin-user role
router.patch("/verify/:userId", updateRole);

export { router as authRouter };
