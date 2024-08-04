import type { IUserService } from "./IUserService";
import type { ISessionService } from "./ISessionService";
import type { ITokenService, IAuthTokens } from "./ITokenService";
import type { TRegisterUserInput, TLoginUserInput } from "../types";
import type { User } from "@prisma/client";

export interface IAuthServiceDependencies {
  userService: IUserService;
  sessionService: ISessionService;
  tokenService: ITokenService;
}

export interface IAuthService {
  register(data: TRegisterUserInput): Promise<{ user: User; tokens: IAuthTokens }>;
  login(data: TLoginUserInput): Promise<{ user: User; tokens: IAuthTokens }>;
  refresh(refreshToken: string | undefined): Promise<IAuthTokens>;
  logout(refreshToken: string): Promise<void>;
}
