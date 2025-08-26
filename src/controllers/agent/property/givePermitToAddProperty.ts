import { config } from "@/config/config";
import { prisma } from "@/lib/prisma";
import { sendAddPropertyMail } from "@/mails/sendAddPropertyMail";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const givePermitToAddProperty = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        permittedToAddProperty: true,
        isDraft: true,
        agentId: req.user.id,
      },
      config.jwtsecret,
      {
        expiresIn: "1d",
      }
    );

    const link = `${config.clienturl}/property?token=${token}`;

    await sendAddPropertyMail(user.email, link);
    
    return res
      .status(200)
      .json({ message: "Property adding email sent successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
