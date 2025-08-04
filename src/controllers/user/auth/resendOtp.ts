import { sendOtp } from "@/mails/sendOtp";
import { Request, Response } from "express";

export const resendOtp = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(400).json({ message: "Unauthorized" });
  }

  try {
    await sendOtp(req.user.email, "user");

    return res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Error resending OTP:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
