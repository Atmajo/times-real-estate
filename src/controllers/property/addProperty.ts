import { prisma } from "@/lib/prisma";
import { validator } from "@/lib/validator";
import logger from "@/logger/logger";
import { addPropertySchema } from "@/schemas";
import { Request, Response } from "express";

export const addProperty = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  try {
    const body = req.body;
    const validatedData = validator({ schema: addPropertySchema, body });

    if (!validatedData) {
      return res.status(400).json({ error: "Invalid data" });
    }

    // Validate foreign key references
    const [developer, community, paymentPlan, area] = await Promise.all([
      prisma.developer.findUnique({
        where: { id: validatedData.developerId },
      }),
      prisma.community.findUnique({
        where: { id: validatedData.communityId },
      }),
      prisma.paymentPlan.findUnique({
        where: { id: validatedData.paymentPlanId },
      }),
      prisma.area.findUnique({ where: { id: validatedData.areaId } }),
    ]);

    if (!developer)
      return res.status(404).json({ error: "Developer not found" });
    if (!community)
      return res.status(404).json({ error: "Community not found" });
    if (!paymentPlan)
      return res.status(404).json({ error: "Payment plan not found" });
    if (!area) return res.status(404).json({ error: "Area not found" });
    const property = await prisma.property.create({
      data: { ...validatedData, userId: req.user.id },
      include: {
        developer: true,
        community: true,
        paymentPlan: true,
        area: true,
      },
    });
    
    return res.status(201).json({
      message: "Property added successfully",
      property,
    });
  } catch (error) {
    console.log(error)
    logger.error("Error in addProperty controller:", error);
    res.status(500).json({ error: "Failed to add property" });
  }
};
