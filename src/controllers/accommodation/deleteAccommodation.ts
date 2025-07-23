import { prisma } from "@/lib/prisma";
import logger from "@/logger/logger";
import { Request, Response } from "express";

export const deleteAccommodation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingAccommodation = await prisma.accommodation.findUnique({
      where: { id },
    });

    if (!existingAccommodation) {
      return res.status(404).json({ error: "Accommodation not found" });
    }

    await prisma.accommodation.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Accommodation deleted successfully",
    });
  } catch (error) {
    logger.error("Error in deleteAccommodation controller:", error);
    res.status(500).json({ error: "Failed to delete accommodation" });
  }
};
