import { prisma } from "@/lib/prisma";
import { validator } from "@/lib/validator";
import logger from "@/logger/logger";
import { updateAccommodationSchema } from "@/schemas";
import { Request, Response } from "express";

export const updateAccommodation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const existingAccommodation = await prisma.accommodation.findUnique({
      where: { id },
    });

    if (!existingAccommodation) {
      return res.status(404).json({ error: "Accommodation not found" });
    }

    const validatedData = validator({
      schema: updateAccommodationSchema,
      body,
    });

    if (!validatedData) {
      return res.status(400).json({ error: "Invalid data" });
    }
    
    const accommodation = await prisma.accommodation.update({
      where: { id },
      data: validatedData,
    });

    return res.status(200).json({
      message: "Accommodation updated successfully",
      data: accommodation,
    });
  } catch (error) {
    logger.error("Error in updateAccommodation controller:", error);
    res.status(500).json({ error: "Failed to update accommodation" });
  }
};
