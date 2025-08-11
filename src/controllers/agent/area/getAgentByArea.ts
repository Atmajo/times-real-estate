import { paginate } from "@/lib/paginate";
import { prisma } from "@/lib/prisma";
import { Request, Response } from "express";

export const getAgentByArea = async (req: Request, res: Response) => {
  try {
    const { area, page, limit, all } = req.query as unknown as {
      area: string;
      page: string;
      limit: string;
      all: string;
    };

    const areas = await prisma.area.findUnique({
      where: { name: area },
      select: { user: true },
    });

    const agents =
      areas?.user.map((u) => {
        return { ...u, password: null };
      }) || [];
    
    if (all) {
      return res.status(200).json({ agents });
    }

    const paginatedData = paginate(
      agents,
      Number(page) || 1,
      Number(limit) || 10
    );

    res.status(200).json({ ...paginatedData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
