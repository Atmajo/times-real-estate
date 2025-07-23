import { Request, Response } from "express";
import { prisma } from "@/lib/prisma";
import logger from "@/logger/logger";

export const getPossession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const possession = await prisma.possession.findUnique({
      where: { id },
      include: {
        properties: true,
      },
    });

    if (!possession) {
      return res.status(404).json({ error: "Possession not found" });
    }

    return res.status(200).json({ possession });
  } catch (error) {
    logger.error("Error in getPossession controller:", error);
    res.status(500).json({ error: "Failed to get possession" });
  }
};
