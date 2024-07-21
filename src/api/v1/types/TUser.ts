import { z } from "zod";
import { registerUserSchema, loginUserSchema } from "../validations";

export type TRegisterUserData = z.infer<typeof registerUserSchema>;
export type TLoginUserData = z.infer<typeof loginUserSchema>;
