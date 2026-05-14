import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";
import { asyncHandler } from "./asyncHandler.js";

export const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Token kerak." });
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(401).json({ message: "Foydalanuvchi topilmadi." });
    }

    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ message: "Token noto'g'ri yoki muddati tugagan." });
  }
});

export function requireAdmin(req, res, next) {
  if (!["ADMIN", "OWNER"].includes(req.user?.role)) {
    return res.status(403).json({ message: "Bu amal uchun admin huquqi kerak." });
  }

  return next();
}
