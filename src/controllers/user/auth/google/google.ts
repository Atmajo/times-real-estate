import { config } from "@/config/config";
import logger from "@/logger/logger";
import { generateGoogleRedirectUrl } from "@/service/google";
import { Request, Response } from "express";
import { Credentials } from "google-auth-library";
import jwt from "jsonwebtoken";

declare module "express-session" {
  interface SessionData {
    tokens?: Credentials;
  }
}

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const url = await generateGoogleRedirectUrl();
    
    res.redirect(url);
  } catch (error) {
    console.log(error);
    logger.error("Google authentication failed", error);
    res.status(500).json({ error: "Google authentication failed" });
  }
};
