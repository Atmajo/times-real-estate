import { Area, Community } from "@/generated/prisma/wasm";
import { prisma } from "@/lib/prisma";
import { validator } from "@/lib/validator";
import logger from "@/logger/logger";
import { addDeveloperSchema } from "@/schemas";
import { Request, Response } from "express";

export const addDeveloper = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const validatedData = validator({
      schema: addDeveloperSchema,
      body,
    });

    if (!validatedData) {
      return res.status(400).json({ error: "Invalid data" });
    }

    const { communityId } = validatedData;

    const communityPromises = communityId.map(async (element: any) => {
      const foundCommunity = await prisma.community.findUnique({
        where: { id: element },
      });
      return foundCommunity;
    });

    const communityResults = await Promise.all(communityPromises);
    const community: Community[] = communityResults.filter(
      (foundCommunity): foundCommunity is Community => foundCommunity !== null
    );

    const developer = await prisma.developer.create({
      data: {
        ...validatedData,
        community: {
          connect: community.map((c) => ({ id: c.id })),
        },
      },
      include: {
        community: true,
      },
    });

    return res.status(201).json({
      message: "Developer added successfully",
      data: developer,
    });
  } catch (error) {
    logger.error("Error in addDeveloper controller:", error);
    res.status(500).json({ error: "Failed to add developer" });
  }
};
