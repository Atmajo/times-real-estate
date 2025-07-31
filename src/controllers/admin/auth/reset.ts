import { prisma } from "@/lib/prisma";
import logger from "@/logger/logger";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { sendOtp } from "@/mails/sendOtp";

export const reset = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { password } = req.body;

    const existingUser = await prisma.admin.findUnique({
      where: { email: req.user.email },
    });

    if (!existingUser) {
      return res.status(409).json({ message: "User doesn't exists" });
    }

    const hashedPassword = password && (await bcrypt.hash(password, 10));

    await prisma.admin.update({
      where: { email: req.user.email },
      data: {
        password: hashedPassword && hashedPassword,
      },
    });

    await sendOtp(req.user.email, "admin");

    return res.status(200).json({
      message: "Password reset successful",
      success: true,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.startsWith("Validation failed")
    ) {
      logger.error("Validation error:", error.message);
      return res.status(400).json({
        message: "Invalid request data",
        details: error.message,
      });
    }

    logger.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
