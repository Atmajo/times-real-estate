import { prisma } from "@/lib/prisma";
import logger from "@/logger/logger";
import { Request, Response } from "express";
import { validator } from "@/lib/validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { registerSchema } from "@/schemas";

export const userRegister = async (req: Request, res: Response) => {
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

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: "user" },
      process.env.JWT_SECRET as string,
      { expiresIn: "30d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
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
