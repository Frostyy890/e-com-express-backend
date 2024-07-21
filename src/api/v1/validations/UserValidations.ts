import { z } from "zod";
import { Role } from "@prisma/client";

export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, "required to be at least 3 characters long")
    .max(255, "required to be less than 255 characters"),
  email: z.string().email("not a valid email").max(255, "required to be less than 255 characters"),
  password: z
    .string()
    .min(6, "required to be at least 6 characters long")
    .max(255, "required to be less than 255 characters"),
  role: z.enum([Role.USER, Role.ADMIN], { errorMap: () => ({ message: "invalid value" }) }),
});

export const updateUserSchema = createUserSchema.partial();

export const registerUserSchema = createUserSchema.omit({ role: true });

export const loginUserSchema = registerUserSchema.omit({ email: true });
