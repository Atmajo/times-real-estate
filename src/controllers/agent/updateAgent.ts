import { prisma } from "@/lib/prisma";
import logger from "@/logger/logger";
import { Request, Response } from "express";

export const updateAgent = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const agent = await prisma.admin.update({
      where: { id: req.user.id },
      data: req.body,
    });

    res.status(204).json({ data: agent });
  } catch (error) {
    logger.error("Error updating agent:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
