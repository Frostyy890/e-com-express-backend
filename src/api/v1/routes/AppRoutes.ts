import { Router } from "express";
import { userRouter } from "./UserRoutes";
import { ExceptionHandler } from "../middlewares";

export const appRouter: Router = Router();
appRouter.use("/users", userRouter);
appRouter.use(ExceptionHandler);
