import { Router } from "express";
import { AuthController } from "../controllers";
import { UserService, SessionService, TokenService, AuthService } from "../services";
import { catchAsync } from "../utils";
import { ValidateRequest } from "../middlewares";
import { registerUserSchema, loginUserSchema } from "../validations";

const userService = new UserService();
const sessionService = new SessionService();
const tokenService = new TokenService();
const authService = new AuthService({ userService, sessionService, tokenService });
const authController = new AuthController({ authService });

export const authRouter: Router = Router();
authRouter
  .post(
    "/register",
    ValidateRequest(registerUserSchema),
    catchAsync(authController.register.bind(authController))
  )
  .post(
    "/login",
    ValidateRequest(loginUserSchema),
    catchAsync(authController.login.bind(authController))
  )
  .post("/refresh", catchAsync(authController.refresh.bind(authController)))
  .post("/logout", catchAsync(authController.logout.bind(authController)));
