import { Router } from "express";
import { UserController } from "../controllers";
import { ValidateRequest } from "../middlewares";
import { createUserSchema, updateUserSchema } from "../validations";
import { catchAsync } from "../utils";

const userController = new UserController();

export const userRouter: Router = Router();
userRouter
  .get("/", catchAsync(userController.findMany.bind(userController)))
  .get("/:id", catchAsync(userController.findById.bind(userController)))
  .post(
    "/",
    ValidateRequest(createUserSchema),
    catchAsync(userController.create.bind(userController))
  )
  .patch(
    "/:id",
    ValidateRequest(updateUserSchema),
    catchAsync(userController.update.bind(userController))
  )
  .delete("/:id", catchAsync(userController.delete.bind(userController)));
