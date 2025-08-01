import { Request, Response } from "express";
import { prisma } from "@/lib/prisma";
import logger from "@/logger/logger";

export const getAccommodation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const accommodation = await prisma.accommodation.findUnique({
      where: { id },
      include: {
        properties: true,
      },
    });

    if (!accommodation) {
      return res.status(404).json({ error: "Accommodation not found" });
    }

    return res.status(200).json({ data: accommodation });
  } catch (error) {
    logger.error("Error in getAccommodation controller:", error);
    res.status(500).json({ error: "Failed to get accommodation" });
  }
};
