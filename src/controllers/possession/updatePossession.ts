import { prisma } from "@/lib/prisma";
import { validator } from "@/lib/validator";
import logger from "@/logger/logger";
import { updatePossessionSchema } from "@/schemas";
import { Request, Response } from "express";

export const updatePossession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const existingPossession = await prisma.possession.findUnique({
      where: { id },
    });

    if (!existingPossession) {
      return res.status(404).json({ error: "Possession not found" });
    }

    const validatedData = validator({
      schema: updatePossessionSchema,
      body,
    });

    if (!validatedData) {
      return res.status(400).json({ error: "Invalid data" });
    }
    
    const possession = await prisma.possession.update({
      where: { id },
      data: validatedData,
    });

    return res.status(200).json({
      message: "Possession updated successfully",
      possession,
    });
  } catch (error) {
    logger.error("Error in updatePossession controller:", error);
    res.status(500).json({ error: "Failed to update possession" });
  }
};

export const deletePossession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingPossession = await prisma.possession.findUnique({
      where: { id },
    });

    if (!existingPossession) {
      return res.status(404).json({ error: "Possession not found" });
    }

    await prisma.possession.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Possession deleted successfully",
    });
  } catch (error) {
    logger.error("Error in deletePossession controller:", error);
    res.status(500).json({ error: "Failed to delete possession" });
  }
};
