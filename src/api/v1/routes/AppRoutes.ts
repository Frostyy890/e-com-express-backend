import { Router } from "express";
import { userRouter } from "./UserRoutes";
import { authRouter } from "./AuthRoutes";
import { TokenService, SessionService, UserService } from "../services";
import { AuthMiddleware } from "../middlewares";
import { catchAsync } from "../utils";
import { Role } from "@prisma/client";

const tokenService = new TokenService();
const sessionService = new SessionService();
const userService = new UserService();
const authMiddleware = new AuthMiddleware({ tokenService, sessionService, userService });

export const appRouter: Router = Router();
appRouter.use(
  "/users",
  catchAsync(authMiddleware.verifyToken.bind(authMiddleware)),
  catchAsync(authMiddleware.verifyRole(Role.ADMIN).bind(authMiddleware)),
  userRouter
);
appRouter.use("/auth", authRouter);
