import { prisma } from "@/lib/prisma";
import { validator } from "@/lib/validator";
import logger from "@/logger/logger";
import { updateCommunitySchema } from "@/schemas";
import { Request, Response } from "express";

export const updateCommunity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const existingCommunity = await prisma.community.findUnique({
      where: { id },
    });

    if (!existingCommunity) {
      return res.status(404).json({ error: "Community not found" });
    }

    const validatedData = validator({
      schema: updateCommunitySchema,
      body,
    });

    if (!validatedData) {
      return res.status(400).json({ error: "Invalid data" });
    }

    // Check if areaId exists when updating
    if (validatedData.areaId) {
      const area = await prisma.area.findUnique({ where: { id: validatedData.areaId } });
      if (!area) {
        return res.status(404).json({ error: "Area not found" });
      }
    }
    
    const community = await prisma.community.update({
      where: { id },
      data: validatedData,
      include: {
        area: true,
      },
    });

    return res.status(200).json({
      message: "Community updated successfully",
      community,
    });
  } catch (error) {
    logger.error("Error in updateCommunity controller:", error);
    res.status(500).json({ error: "Failed to update community" });
  }
};
