import { sendResetMail } from "@/mails/sendResetMail";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const resendVerification = async (req: Request, res: Response) => {
  try {
    const { id, email, role } = req.body;
    const token = jwt.sign(
      { id: id, email: email, role: role },
      process.env.JWT_SECRET as string,
      { expiresIn: "5M" }
    );

    role === "AGENT" && (await sendResetMail(email, token));

    return res.status(200).json({
      message: "Reset mail sent successfully",
    });
  } catch (error) {
    console.error("Error resending verification email:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
