import type { Request, Response, NextFunction } from "express";
import type { ISessionService } from "./ISessionService";
import type { IUserService } from "./IUserService";
import type { IAuthTokensPayload, ITokenService } from "./ITokenService";
import { Role } from "@prisma/client";

export interface IAuthMiddlewareDependencies {
  tokenService: ITokenService;
  sessionService: ISessionService;
  userService: IUserService;
}

export interface IAuthRequest extends Request {
  userInfo?: IAuthTokensPayload;
}
export interface IAuthMiddleware {
  verifyToken(req: IAuthRequest, _res: Response, next: NextFunction): Promise<void>;
  verifyRole(
    allowedRole: Role
  ): (req: IAuthRequest, _res: Response, next: NextFunction) => Promise<void>;
}
