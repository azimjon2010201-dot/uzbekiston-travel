import { asyncHandler } from "../../middleware/asyncHandler.js";
import { deleteUser, listUsers, loginUser, registerUser, updateUser } from "./user.service.js";
import { loginSchema, registerSchema, updateUserSchema } from "./user.validators.js";

export const register = asyncHandler(async (req, res) => {
  const payload = registerSchema.parse(req.body);
  const result = await registerUser(payload);
  return res.status(201).json(result);
});

export const login = asyncHandler(async (req, res) => {
  const payload = loginSchema.parse(req.body);
  const result = await loginUser(payload);

  if (!result) {
    return res.status(401).json({ message: "Email yoki parol noto'g'ri." });
  }

  return res.json(result);
});

export const users = asyncHandler(async (req, res) => {
  const result = await listUsers();
  return res.json({ users: result });
});

export const update = asyncHandler(async (req, res) => {
  const payload = updateUserSchema.parse(req.body);
  const user = await updateUser(req.params.id, payload);
  return res.json({ user });
});

export const remove = asyncHandler(async (req, res) => {
  const user = await deleteUser(req.params.id);
  return res.json({ user });
});
