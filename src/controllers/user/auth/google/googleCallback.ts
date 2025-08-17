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

    console.log("tokens: ", req.session.tokens);

    res.redirect(config.frontendurl);
  } catch (error) {
    console.log(error);
    logger.error("Google authentication failed", error);
    res.status(500).json({ error: "Google authentication failed" });
  }
};
