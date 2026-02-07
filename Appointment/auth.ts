import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { type Request, type Response, type NextFunction } from "express";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const UserAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }
  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as {
      userId: number;
      role: string;
    };
    (req as any).user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid token" });
  }
};

export const AdminAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }
  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as {
      userId: number;
      role: string;
    };
    if (decoded.role !== "service_provider") {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }
    (req as any).user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid token" });
  }
};
