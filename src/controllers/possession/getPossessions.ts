import { Request, Response } from "express";
import { prisma } from "@/lib/prisma";
import logger from "@/logger/logger";
import { paginate } from "@/lib/paginate";

export const getPossessions = async (req: Request, res: Response) => {
  try {
    const possessions = await prisma.possession.findMany({
      include: {
        properties: true,
      },
    });

    if (!possessions) {
      return res.status(404).json({ error: "Possessions not found" });
    }

    const { page, limit, totalPages, totalItems, items } = paginate(
      possessions,
      Number(req.query.page) || 1,
      Number(req.query.limit) || 10
    );

    return res.status(200).json({ page, limit, totalPages, totalItems, items });
  } catch (error) {
    logger.error("Error in getPossessions controller:", error);
    res.status(500).json({ error: "Failed to get possessions" });
  }
};

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
