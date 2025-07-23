import { prisma } from "@/lib/prisma";
import { validator } from "@/lib/validator";
import logger from "@/logger/logger";
import { addPossessionSchema } from "@/schemas";
import { Request, Response } from "express";

export const addPossession = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const validatedData = validator({
      schema: addPossessionSchema,
      body,
    });

    if (!validatedData) {
      return res.status(400).json({ error: "Invalid data" });
    }

    const { value } = validatedData;
    const possession = await prisma.possession.create({
      data: {
        value,
      },
    });

    return res.status(201).json({
      message: "Possession added successfully",
      possession,
    });
  } catch (error) {
    logger.error("Error in addPossession controller:", error);
    res.status(500).json({ error: "Failed to add possession" });
  }
};
