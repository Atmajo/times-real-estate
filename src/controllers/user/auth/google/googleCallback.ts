import { config } from "@/config/config";
import logger from "@/logger/logger";
import { generateGoogleToken } from "@/service/google";
import { Request, Response } from "express";

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: "Authorization code is required" });
    }

    const tokens = await generateGoogleToken(code as unknown as string);

    req.session.tokens = tokens;

    const frontendurl = config.frontendurl;

    const expiryDateInSeconds =
      tokens.expiry_date || Math.floor(Date.now() / 1000) + 3600;
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const secondsRemaining = expiryDateInSeconds - currentTimeInSeconds;
    const daysRemaining = Math.floor(secondsRemaining / (60 * 60 * 24));

    res.redirect(
      frontendurl +
        "/dashboard/request-tour?refresh_token=" +
        tokens.refresh_token +
        "&days_remaining=" +
        daysRemaining
    );
  } catch (error) {
    console.log(error);
    logger.error("Google authentication failed", error);
    res.status(500).json({ error: "Google authentication failed" });
  }
};
