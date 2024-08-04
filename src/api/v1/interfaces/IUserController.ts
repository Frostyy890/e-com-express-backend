import type { Request, Response } from "express";
import type { IUserService } from "./IUserService";

export interface IUserControllerDependencies {
  userService: IUserService;
}

export interface IUserController {
  findMany(req: Request, res: Response): Promise<void>;
  findById(req: Request, res: Response): Promise<void>;
  create(req: Request, res: Response): Promise<void>;
  update(req: Request, res: Response): Promise<void>;
  delete(req: Request, res: Response): Promise<void>;
}
