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
    const cookie =
      (req.headers?.cookie?.match(/token=([^;]+)/) as unknown as string)[1] ||
      req.cookies;

    const token = cookie;

    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const decoded = jwt.verify(token, config.jwtsecret) as {
      id: string;
      email: string;
      role: string;
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
