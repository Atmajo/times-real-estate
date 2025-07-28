import { Router } from "express";
import { verifyToken } from "@/middlewares/token";
import multer from "multer";
import { fileUpload } from "@/controllers/upload/fileUpload";

const router = Router();

const upload = multer({ dest: "uploads/", limits: { fileSize: 1000000 } });

router.post("/upload", upload.single("file"), fileUpload);

export { router as fileRouter };
