import { prisma } from "@/lib/prisma";
import { validator } from "@/lib/validator";
import logger from "@/logger/logger";
import { addAccommodationSchema } from "@/schemas";
import { Request, Response } from "express";

export const addAccommodation = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const validatedData = validator({
      schema: addAccommodationSchema,
      body,
    });

    if (!validatedData) {
      return res.status(400).json({ error: "Invalid data" });
    }

    const { value } = validatedData;
    const accommodation = await prisma.accommodation.create({
      data: {
        value,
      },
    });

    return res.status(201).json({
      message: "Accommodation added successfully",
      accommodation,
    });
  } catch (error) {
    logger.error("Error in addAccommodation controller:", error);
    res.status(500).json({ error: "Failed to add accommodation" });
  }
};
