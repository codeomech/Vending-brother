import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token);
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    console.log("inside Try block");
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    console.log(decoded);
    if (!decoded.user.isAdmin) throw new Error();
    (req as any).user = decoded.user;
    next();
  } catch (err) {
    res.status(403).json({ message: "Forbidden: Admins only" });
  }
};
