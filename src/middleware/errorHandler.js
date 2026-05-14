import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export function notFoundHandler(req, res) {
  res.status(404).json({ message: "Endpoint topilmadi." });
}

export function errorHandler(error, req, res, next) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Validation xatosi.",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message
      }))
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return res.status(409).json({
      message: "Bu email yoki telefon raqam allaqachon ro'yxatdan o'tgan."
    });
  }

  console.error(error);
  return res.status(500).json({ message: "Serverda xatolik yuz berdi." });
}
