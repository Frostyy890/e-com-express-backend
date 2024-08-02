import { Request, Response, NextFunction } from "express";

export const Logger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const message = `[${new Date().toISOString()}] ${res.statusCode} - ${
      req.method
    } - ${req.originalUrl} - ${req.ip} - ${
      req.headers["user-agent"]
    } - ${duration}ms `;
    console.log(message);
  });
  next();
};
