import { Request, Response } from "express";
import { prisma } from "@/lib/prisma";
import logger from "@/logger/logger";
import { paginate } from "@/lib/paginate";

export const getCommunities = async (req: Request, res: Response) => {
  try {
    const communities = await prisma.community.findMany({
      include: {
        area: true,
        properties: true,
      },
    });

    if (!communities) {
      return res.status(404).json({ error: "Communities not found" });
    }

    const { page, limit, totalPages, totalItems, items } = paginate(
      communities,
      Number(req.query.page) || 1,
      Number(req.query.limit) || 10
    );

    return res.status(200).json({ page, limit, totalPages, totalItems, items });
  } catch (error) {
    logger.error("Error in getCommunities controller:", error);
    res.status(500).json({ error: "Failed to get communities" });
  }
};
