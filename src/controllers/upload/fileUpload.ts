import { Request, Response } from "express";
import { uploadFile } from "@/lib/uploadFile";
import logger from "@/logger/logger";
import fs from "fs/promises";

const acceptedFileTypes = ["image/jpeg", "image/png", "application/pdf"];

export const fileUpload = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!req.file) {
    return res.status(500).json({ message: "File missing" });
  }

  if (!acceptedFileTypes.includes(req.file.mimetype)) {
    return res.status(500).json({ message: "Invalid file" });
  }

  try {
    const { email } = req.user;

    const { s3FileUrl } = await uploadFile(req.file, email);

    await fs.unlink(req.file.path);

    return res.status(200).json({
      message: "File uploaded",
      s3FileUrl,
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error("File upload error");
      return res.status(500).json({
        message: "Internal server error",
        details: error.message,
      });
    }
    return res.status(500).json({
      message: "An unexpected error occurred",
    });
  }
};
