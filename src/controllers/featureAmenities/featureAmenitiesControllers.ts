import { prisma } from "@/lib/prisma";
import { validator } from "@/lib/validator";
import logger from "@/logger/logger";
import { addFeatureAmenitiesSchema, updateFeatureAmenitiesSchema } from "@/schemas";
import { Request, Response } from "express";
import { paginate } from "@/lib/paginate";

export const addFeatureAmenities = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const validatedData = validator({ schema: addFeatureAmenitiesSchema, body });

    if (!validatedData) {
      return res.status(400).json({ error: "Invalid data" });
    }

    const { name, logo } = validatedData;
    const featureAmenities = await prisma.featureAmenities.create({
      data: { name, logo },
    });

    return res.status(201).json({
      message: "Feature amenities added successfully",
      featureAmenities,
    });
  } catch (error) {
    logger.error("Error in addFeatureAmenities controller:", error);
    res.status(500).json({ error: "Failed to add feature amenities" });
  }
};

export const getFeatureAmenities = async (req: Request, res: Response) => {
  try {
    const featureAmenities = await prisma.featureAmenities.findMany({
      include: { properties: true },
    });

    const { page, limit, totalPages, totalItems, items } = paginate(
      featureAmenities,
      Number(req.query.page) || 1,
      Number(req.query.limit) || 10
    );

    return res.status(200).json({ page, limit, totalPages, totalItems, items });
  } catch (error) {
    logger.error("Error in getFeatureAmenities controller:", error);
    res.status(500).json({ error: "Failed to get feature amenities" });
  }
};

export const getSingleFeatureAmenities = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const featureAmenities = await prisma.featureAmenities.findUnique({
      where: { id },
      include: { properties: true },
    });

    if (!featureAmenities) {
      return res.status(404).json({ error: "Feature amenities not found" });
    }

    return res.status(200).json({ featureAmenities });
  } catch (error) {
    logger.error("Error in getSingleFeatureAmenities controller:", error);
    res.status(500).json({ error: "Failed to get feature amenities" });
  }
};

export const updateFeatureAmenities = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const existingFeatureAmenities = await prisma.featureAmenities.findUnique({ where: { id } });
    if (!existingFeatureAmenities) {
      return res.status(404).json({ error: "Feature amenities not found" });
    }

    const validatedData = validator({ schema: updateFeatureAmenitiesSchema, body });
    if (!validatedData) {
      return res.status(400).json({ error: "Invalid data" });
    }
    
    const featureAmenities = await prisma.featureAmenities.update({
      where: { id },
      data: validatedData,
    });

    return res.status(200).json({
      message: "Feature amenities updated successfully",
      featureAmenities,
    });
  } catch (error) {
    logger.error("Error in updateFeatureAmenities controller:", error);
    res.status(500).json({ error: "Failed to update feature amenities" });
  }
};

export const deleteFeatureAmenities = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existingFeatureAmenities = await prisma.featureAmenities.findUnique({ where: { id } });

    if (!existingFeatureAmenities) {
      return res.status(404).json({ error: "Feature amenities not found" });
    }

    await prisma.featureAmenities.delete({ where: { id } });

    return res.status(200).json({
      message: "Feature amenities deleted successfully",
    });
  } catch (error) {
    logger.error("Error in deleteFeatureAmenities controller:", error);
    res.status(500).json({ error: "Failed to delete feature amenities" });
  }
};
