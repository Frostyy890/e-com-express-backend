import { z } from "zod";
import { registerUserSchema, loginUserSchema } from "../validations";

export type TRegisterUserInput = z.infer<typeof registerUserSchema>;
export type TLoginUserInput = z.infer<typeof loginUserSchema>;
