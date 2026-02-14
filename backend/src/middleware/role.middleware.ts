import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

export function requireRole(role: "ADMIN" | "CORE" | "VOLUNTEER") {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const assignment = await prisma.roleAssignment.findFirst({
      where: {
        userId,
        role,
      },
    });

    if (!assignment) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
}
