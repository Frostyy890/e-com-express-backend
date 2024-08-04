import {
  IAuthService,
  IAuthServiceDependencies,
  IUserService,
  ISessionService,
  ITokenService,
} from "../interfaces";
import { SessionStatus } from "@prisma/client";
import type { TLoginUserInput, TRegisterUserInput } from "../types";
import bcrypt from "bcrypt";
import { HttpException } from "../utils";
import { HttpStatusCodes } from "../constants";
import { settings } from "@config/settings";
import { TokenExpiredError } from "jsonwebtoken";

export class AuthService implements IAuthService {
  private userService: IUserService;
  private sessionService: ISessionService;
  private tokenService: ITokenService;
  constructor({ userService, sessionService, tokenService }: IAuthServiceDependencies) {
    this.userService = userService;
    this.sessionService = sessionService;
    this.tokenService = tokenService;
  }
  async register(data: TRegisterUserInput) {
    const user = await this.userService.create(data);
    const tokens = await this._createSessionWithTokens(user.id);
    return { user, tokens };
  }
  async login(data: TLoginUserInput) {
    const user = await this.userService.findOne({ username: data.username });
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Invalid credentials");
    }
    const tokens = await this._createSessionWithTokens(user.id);
    return { user, tokens };
  }

  async refresh(refreshToken: string | undefined) {
    if (!refreshToken) this.throwUnauthorized();
    const session = await this.sessionService.findOne({ refreshToken });
    if (!session) this.throwUnauthorized();
    try {
      this.tokenService.verifyToken(refreshToken, settings.jwt.refreshToken.secret);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        await this.sessionService.update({ id: session.id }, { status: SessionStatus.EXPIRED });
      }
      this.throwUnauthorized();
    }
    const tokens = await this._updateSessionWithTokens(session.userId, session.id);
    return tokens;
  }

  private async _createSessionWithTokens(userId: string) {
    const session = await this.sessionService.create({
      user: { connect: { id: userId } },
    });
    const tokens = await this._updateSessionWithTokens(userId, session.id);
    return tokens;
  }

  private async _updateSessionWithTokens(userId: string, sessionId: string) {
    const tokens = this.tokenService.generateAuthTokens({ userId, sessionId });
    await this.sessionService.update(
      { id: sessionId },
      { refreshToken: tokens.refreshToken, expiresAt: tokens.refreshTokenExpiry }
    );
    return tokens;
  }

  async logout(refreshToken: string) {
    const session = await this.sessionService.findOne({ refreshToken });
    if (session) {
      await this.sessionService.update({ id: session.id }, { status: SessionStatus.REVOKED });
    }
    return;
  }

  private throwUnauthorized(): never {
    throw new HttpException(HttpStatusCodes.UNAUTHORIZED);
  }
}
