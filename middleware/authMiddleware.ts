import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ExtendedRequest } from "../controller/UserController";
import dotenv from 'dotenv';
dotenv.config();
export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Token not provided' });
  }
  const secretKey = process.env.SECRET_KEY || ''; 
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }

    const { username } = decoded as { username: string };
    (req as ExtendedRequest).decodedUsername = username;
    next();
  });
}
