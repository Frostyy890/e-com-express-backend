import type { IAuthService } from "./IAuthService";
import type { Request, Response } from "express";

export interface IAuthControllerDependencies {
  authService: IAuthService;
}

export interface IAuthController {
  register(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
  refresh(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
}
