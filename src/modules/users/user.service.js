import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { prisma } from "../../config/prisma.js";

const userSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  role: true,
  createdAt: true,
  updatedAt: true
};

export function toPublicUser(user) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

function createToken(user) {
  return jwt.sign(
    {
      email: user.email,
      role: user.role
    },
    env.JWT_SECRET,
    {
      subject: user.id,
      expiresIn: env.JWT_EXPIRES_IN
    }
  );
}

export async function registerUser(payload) {
  const passwordHash = await bcrypt.hash(payload.password, 12);

  const user = await prisma.user.create({
    data: {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone.replace(/\s+/g, ""),
      passwordHash
    },
    select: userSelect
  });

  return {
    user: toPublicUser(user),
    token: createToken(user)
  };
}

export async function loginUser(payload) {
  const user = await prisma.user.findUnique({
    where: { email: payload.email }
  });

  if (!user) {
    return null;
  }

  const passwordMatches = await bcrypt.compare(payload.password, user.passwordHash);
  if (!passwordMatches) {
    return null;
  }

  return {
    user: toPublicUser(user),
    token: createToken(user)
  };
}

export async function listUsers() {
  return prisma.user.findMany({
    select: userSelect,
    orderBy: { createdAt: "desc" }
  });
}

export async function updateUser(id, payload) {
  const data = { ...payload };
  if (data.phone) {
    data.phone = data.phone.replace(/\s+/g, "");
  }

  return prisma.user.update({
    where: { id },
    data,
    select: userSelect
  });
}

export async function deleteUser(id) {
  return prisma.user.delete({
    where: { id },
    select: userSelect
  });
}
