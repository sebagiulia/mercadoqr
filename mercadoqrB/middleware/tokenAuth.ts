import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TokenError } from "../errors/errors";

const JWT_SECRET = process.env.JWT_SECRET || "supersecreto";

export interface AuthRequest extends Request {
  placeId?: number;
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (!token) 
    throw new TokenError("Token no proporcionado.");
  jwt.verify(token, JWT_SECRET, (err:any, payload: any) => {
    if (err)
      throw new TokenError();
    req.placeId = payload.placeId;
    next();
  });
}
