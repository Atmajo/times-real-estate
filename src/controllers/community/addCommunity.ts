import { Area } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { validator } from "@/lib/validator";
import logger from "@/logger/logger";
import { addCommunitySchema } from "@/schemas";
import { Request, Response } from "express";

export const addCommunity = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const validatedData = validator({
      schema: addCommunitySchema,
      body,
    });

    if (!validatedData) {
      return res.status(400).json({ error: "Invalid data" });
    }

    const { name, description, areaId } = validatedData;
    
    const areaPromises = areaId.map(async (element: any) => {
      const foundArea = await prisma.area.findUnique({
        where: { id: element },
      });
      return foundArea;
    });
    
    const areaResults = await Promise.all(areaPromises);
    const area: Area[] = areaResults.filter(
      (foundArea): foundArea is Area => foundArea !== null
    );
    
    const community = await prisma.community.create({
      data: {
        name,
        description,
        area: {
          connect: area.map((a) => ({ id: a.id })),
        },
      },
      include: {
        area: true,
      },
    });

    return res.status(201).json({
      message: "Community added successfully",
      community,
    });
  } catch (error) {
    logger.error("Error in addCommunity controller:", error);
    res.status(500).json({ error: "Failed to add community" });
  }
};
