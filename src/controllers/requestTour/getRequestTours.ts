import { prisma } from "@/lib/prisma";
import { validator } from "@/lib/validator";
import logger from "@/logger/logger";
import { getRequestToursSchema } from "@/schemas";
import { Request, Response } from "express";
import { paginate } from "@/lib/paginate";

export const getRequestTours = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const query = req.query;
    const validatedQuery = validator({ schema: getRequestToursSchema, body: query });

    if (!validatedQuery) {
      return res.status(400).json({ error: "Invalid query parameters" });
    }

    const page = parseInt(validatedQuery.page || "1");
    const limit = parseInt(validatedQuery.limit || "10");

    const requestTours = await prisma.requestTour.findMany({
      where: { userId },
      include: {
        property: {
          include: {
            developer: true,
            community: true,
            area: true,
            paymentPlan: true,
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const paginatedResult = paginate(requestTours, page, limit);

    logger.info(`Request tours retrieved for user ${userId}`);
    res.status(200).json({
      message: "Request tours retrieved successfully",
      ...paginatedResult
    });
  } catch (error) {
    logger.error(`Error retrieving request tours: ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getRequestTour = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!id) {
      return res.status(400).json({ error: "Request tour ID is required" });
    }

    const requestTour = await prisma.requestTour.findFirst({
      where: { 
        id,
        userId 
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        property: {
          include: {
            developer: true,
            community: true,
            area: true,
            paymentPlan: true,
          }
        }
      }
    });

    if (!requestTour) {
      return res.status(404).json({ error: "Request tour not found" });
    }

    logger.info(`Request tour ${id} retrieved for user ${userId}`);
    res.status(200).json({
      message: "Request tour retrieved successfully",
      data: requestTour,
    });
  } catch (error) {
    logger.error(`Error retrieving request tour: ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};
