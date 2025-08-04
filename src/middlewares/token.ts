import { NextFunction, Request, Response } from "express";
import { config } from "../config/config";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        otp?: string;
        iat: number;
        exp: number;
      };
    }
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const decoded = jwt.verify(token, config.jwtsecret) as {
      id: string;
      email: string;
      role: string;
      otp?: string;
      iat: number;
      exp: number;
    };

    if (!decoded) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (decoded.role === "UNVERIFIED") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      res.status(401).json({ error: "Token expired" });
      return;
    }

    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
};
