import { prisma } from "@/lib/prisma";
import logger from "@/logger/logger";
import { Request, Response } from "express";
import { validator } from "@/lib/validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { registerSchema } from "@/schemas";
import { sendResetMail } from "@/mails/sendResetMail";
import { generateOtp } from "@/lib/generateOtp";

export const register = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const validatedData = validator({
      schema: registerSchema,
      body,
    });

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword =
      validatedData.password && (await bcrypt.hash(validatedData.password, 10));

    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword && hashedPassword,
        role: validatedData.role,
        otp: generateOtp(),
        otpExpires: new Date(Date.now() + 5 * 60 * 1000),
      },
    });
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, otp: user.otp },
      process.env.JWT_SECRET as string,
      { expiresIn: "5M" }
    );

    // TODO: reset mail
    validatedData.role === "AGENT" && (await sendResetMail(user.email, token));

    return res.status(200).json({
      message: "Registration successful",
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
