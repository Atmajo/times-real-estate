import { prisma } from "@/lib/prisma";
import logger from "@/logger/logger";
import { Request, Response } from "express";

export const profile = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized profile" });
  }

  try {
    const { id } = req.user;

    console.log("Fetching profile for user ID:", req.user);

    const profile = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        property: true,
      },
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    return res.status(200).json({ data: profile });
  } catch (error) {
    logger.error("Error in profile controller:", error);
    res.status(500).json({ error: "Failed to get profile" });
  }
};
