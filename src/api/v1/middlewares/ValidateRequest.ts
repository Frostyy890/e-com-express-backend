import type { Request, Response, NextFunction } from "express";
import { type z, ZodError } from "zod";
import { HttpException } from "../utils";
import { HttpStatusCodes } from "../constants";

export const ValidateRequest = (
  validationSchema: z.Schema
): ((req: Request, _res: Response, next: NextFunction) => void) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      validationSchema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formatedError = error.errors.map((err) => {
          return err.path.join(".") + " is " + err.message.toLowerCase();
        });
        next(new HttpException(HttpStatusCodes.BAD_REQUEST, formatedError));
      }
      console.error(error);
      next(new HttpException(HttpStatusCodes.BAD_REQUEST));
    }
  };
};
