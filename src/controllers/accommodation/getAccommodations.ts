import { Request, Response } from "express";
import { prisma } from "@/lib/prisma";
import logger from "@/logger/logger";
import { paginate } from "@/lib/paginate";

export const getAccommodations = async (req: Request, res: Response) => {
  try {
    const accommodations = await prisma.accommodation.findMany({
      include: {
        properties: true,
      },
    });

    if (!accommodations) {
      return res.status(404).json({ error: "Accommodations not found" });
    }

    const { page, limit, totalPages, totalItems, items } = paginate(
      accommodations,
      Number(req.query.page) || 1,
      Number(req.query.limit) || 10
    );

    return res.status(200).json({ page, limit, totalPages, totalItems, items });
  } catch (error) {
    logger.error("Error in getAccommodations controller:", error);
    res.status(500).json({ error: "Failed to get accommodations" });
  }
};
