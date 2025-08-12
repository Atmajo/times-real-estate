import { Area } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { Request, Response } from "express";

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { adminId } = req.params;
    const body = req.body;

    const areaPromises = body.area.map(async (element: any) => {
      const foundArea = await prisma.area.findUnique({
        where: { id: element },
      });
      return foundArea;
    });

    const areaResults = await Promise.all(areaPromises);
    const area: Area[] = areaResults.filter(
      (foundArea): foundArea is Area => foundArea !== null
    );

    const user = await prisma.user.update({
      where: { id: adminId },
      data: {
        ...body,
        area: {
          connect: area.map((a) => ({ id: a.id })),
        },
      },
      include: {
        area: true,
        Selling: true,
      }
    });

    res.status(200).json({ data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
