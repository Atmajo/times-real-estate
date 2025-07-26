import { Request, Response } from "express";
import { prisma } from "@/lib/prisma";
import logger from "@/logger/logger";
import { paginate } from "@/lib/paginate";

export const getProperties = async (req: Request, res: Response) => {
  try {
    const { 
      status, 
      type, 
      isFeatured, 
      developerId, 
      communityId, 
      areaId,
      minPrice,
      maxPrice,
      minSize,
      maxSize 
    } = req.query;

    const where: any = {};
    
    if (status) where.status = status;
    if (type) where.type = type;
    if (isFeatured !== undefined) where.isFeatured = isFeatured === 'true';
    if (developerId) where.developerId = developerId;
    if (communityId) where.communityId = communityId;
    if (areaId) where.areaId = areaId;
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }
    
    if (minSize || maxSize) {
      where.size = {};
      if (minSize) where.size.gte = parseFloat(minSize as string);
      if (maxSize) where.size.lte = parseFloat(maxSize as string);
    }

    const properties = await prisma.property.findMany({
      where,
      include: {
        developer: true,
        community: true,
        paymentPlan: true,
        featureAmenities: true,
        accommodation: true,
        possession: true,
        area: true,
        propertyContacts: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const { page, limit, totalPages, totalItems, items } = paginate(
      properties,
      Number(req.query.page) || 1,
      Number(req.query.limit) || 10
    );

    return res.status(200).json({ page, limit, totalPages, totalItems, items });
  } catch (error) {
    logger.error("Error in getProperties controller:", error);
    res.status(500).json({ error: "Failed to get properties" });
  }
};

export const getProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        developer: true,
        community: {
          include: {
            area: true,
          },
        },
        paymentPlan: true,
        featureAmenities: true,
        accommodation: true,
        possession: true,
        area: true,
        propertyContacts: true,
      },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    return res.status(200).json({ property });
  } catch (error) {
    logger.error("Error in getProperty controller:", error);
    res.status(500).json({ error: "Failed to get property" });
  }
};
