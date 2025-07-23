import { prisma } from "@/lib/prisma";
import { validator } from "@/lib/validator";
import logger from "@/logger/logger";
import { addPropertySchema, updatePropertySchema } from "@/schemas";
import { Request, Response } from "express";
import { paginate } from "@/lib/paginate";

export const addProperty = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const validatedData = validator({ schema: addPropertySchema, body });

    if (!validatedData) {
      return res.status(400).json({ error: "Invalid data" });
    }

    // Validate foreign key references
    const [developer, community, paymentPlan, featureAmenities, accommodation, possession, area] = await Promise.all([
      prisma.developer.findUnique({ where: { id: validatedData.developerId } }),
      prisma.community.findUnique({ where: { id: validatedData.communityId } }),
      prisma.paymentPlan.findUnique({ where: { id: validatedData.paymentPlanId } }),
      prisma.featureAmenities.findUnique({ where: { id: validatedData.featureAmenitiesId } }),
      prisma.accommodation.findUnique({ where: { id: validatedData.accommodationId } }),
      prisma.possession.findUnique({ where: { id: validatedData.possessionId } }),
      prisma.area.findUnique({ where: { id: validatedData.areaId } }),
    ]);

    if (!developer) return res.status(404).json({ error: "Developer not found" });
    if (!community) return res.status(404).json({ error: "Community not found" });
    if (!paymentPlan) return res.status(404).json({ error: "Payment plan not found" });
    if (!featureAmenities) return res.status(404).json({ error: "Feature amenities not found" });
    if (!accommodation) return res.status(404).json({ error: "Accommodation not found" });
    if (!possession) return res.status(404).json({ error: "Possession not found" });
    if (!area) return res.status(404).json({ error: "Area not found" });

    const { handover, ...otherData } = validatedData;
    const property = await prisma.property.create({
      data: {
        ...otherData,
        handover: new Date(handover),
      },
      include: {
        developer: true,
        community: true,
        paymentPlan: true,
        featureAmenities: true,
        Accommodation: true,
        Possession: true,
        Area: true,
      },
    });

    return res.status(201).json({
      message: "Property added successfully",
      property,
    });
  } catch (error) {
    logger.error("Error in addProperty controller:", error);
    res.status(500).json({ error: "Failed to add property" });
  }
};
