import type { Request, Response, NextFunction } from "express";
import { HttpStatusCodes } from "../constants";
import { CustomError } from "../utils";
import { Prisma } from "@prisma/client";

const ExceptionsFactory = (err: Error, res: Response) => {
  // Handle HttpException Errors
  if (err instanceof CustomError) {
    const { statusCode, errors } = err;
    return res.status(statusCode).send({
      errors: errors.map((error) => {
        return { detail: error };
      }),
    });
  }
  // Handle Prisma Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // console.log(JSON.stringify(err, null, 2));
    if (err.code === "P2002") {
      return res.status(HttpStatusCodes.CONFLICT).send({
        errors: [
          {
            detail: err.meta
              ? `${err.meta?.modelName} with this ${err.meta?.target} already exists`
              : "Conflict",
          },
        ],
      });
    }
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .send({ errors: [{ detail: "Bad Request" }] });
  }
  return null;
};

export const ExceptionHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const handledError = ExceptionsFactory(err, res);
  if (handledError) return handledError;
  console.error("Unhandled exception:", JSON.stringify(err, null, 2));
  return res
    .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
    .send({ errors: [{ detail: "Internal server error" }] });
};
