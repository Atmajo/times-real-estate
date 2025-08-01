import { prisma } from "@/lib/prisma";
import logger from "@/logger/logger";
import { Request, Response } from "express";

export const getQueries = async (req: Request, res: Response) => {
  try {
    const queries = await prisma.agentQuery.findMany();
    res.status(200).json({ data: queries });
  } catch (error) {
    logger.error("Error fetching queries:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
