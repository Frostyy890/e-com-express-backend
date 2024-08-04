import type { Response, NextFunction } from "express";
import type {
  IAuthMiddleware,
  IAuthMiddlewareDependencies,
  IUserService,
  ISessionService,
  ITokenService,
  IAuthRequest,
} from "../interfaces";
import { HttpException } from "../utils";
import { HttpStatusCodes } from "../constants";
import { settings } from "@config/settings";
import { Role } from "@prisma/client";

export class AuthMiddleware implements IAuthMiddleware {
  private readonly tokenService: ITokenService;
  private readonly sessionService: ISessionService;
  private readonly userService: IUserService;
  constructor({ tokenService, sessionService, userService }: IAuthMiddlewareDependencies) {
    this.tokenService = tokenService;
    this.sessionService = sessionService;
    this.userService = userService;
  }
  async verifyToken(req: IAuthRequest, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new HttpException(HttpStatusCodes.UNAUTHORIZED);
    const [tokenType, token] = authHeader.split(" ");
    if (tokenType !== settings.jwt.tokenType) throw new HttpException(HttpStatusCodes.UNAUTHORIZED);
    try {
      const decoded = this.tokenService.verifyToken(token, settings.jwt.accessToken.secret);
      const session = await this.sessionService.findOne({ id: decoded.sessionId });
      if (!session || session.userId !== decoded.userId)
        throw new HttpException(HttpStatusCodes.UNAUTHORIZED);
      req.userInfo = { userId: decoded.userId, sessionId: decoded.sessionId };
      next();
    } catch (error) {
      console.error("Token Verification Error: ", error);
      throw new HttpException(HttpStatusCodes.FORBIDDEN);
    }
  }
  verifyRole(allowedRole: Role) {
    return async (req: IAuthRequest, _res: Response, next: NextFunction) => {
      const user = await this.userService.findOne({ id: req.userInfo?.userId });
      if (!user || user.role !== allowedRole) throw new HttpException(HttpStatusCodes.FORBIDDEN);
      next();
    };
  }
}
