import { prisma } from "@/lib/prisma";
import logger from "@/logger/logger";
import { Request, Response } from "express";

export const deleteAgent = async (req: Request, res: Response) => {
  try {
    await prisma.admin.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    logger.error("Error deleting agent:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
