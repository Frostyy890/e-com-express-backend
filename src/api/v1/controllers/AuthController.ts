import { IAuthController, IAuthControllerDependencies, IAuthService } from "../interfaces";
import type { Request, Response } from "express";
import { UserDto } from "../dto";
import { settings } from "@config/settings";
import { HttpStatusCodes } from "../constants";

const COOKIE_OPTIONS = settings.jwt.refreshToken.cookieOptions;
const COOKIE_NAME = settings.jwt.refreshToken.cookieName;

export class AuthController implements IAuthController {
  private authService: IAuthService;
  constructor({ authService }: IAuthControllerDependencies) {
    this.authService = authService;
  }
  async register(req: Request, res: Response): Promise<void> {
    const { user, tokens } = await this.authService.register(req.body);
    const userDto = new UserDto(user);
    res
      .status(HttpStatusCodes.CREATED)
      .cookie(COOKIE_NAME, tokens.refreshToken, COOKIE_OPTIONS)
      .json({ user: userDto, accessToken: tokens.accessToken });
  }

  async login(req: Request, res: Response): Promise<void> {
    const { user, tokens } = await this.authService.login(req.body);
    const userDto = new UserDto(user);
    res
      .status(HttpStatusCodes.OK)
      .cookie(COOKIE_NAME, tokens.refreshToken, COOKIE_OPTIONS)
      .json({ user: userDto, accessToken: tokens.accessToken });
  }

  async refresh(req: Request, res: Response): Promise<void> {
    const tokens = await this.authService.refresh(req.cookies[COOKIE_NAME]);
    res
      .status(HttpStatusCodes.OK)
      .cookie(COOKIE_NAME, tokens.refreshToken, COOKIE_OPTIONS)
      .json({ accessToken: tokens.accessToken });
  }

  async logout(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies[COOKIE_NAME];
    if (!refreshToken) {
      res.sendStatus(HttpStatusCodes.NO_CONTENT);
      return;
    }
    await this.authService.logout(refreshToken);
    res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS).sendStatus(HttpStatusCodes.NO_CONTENT);
  }
}
