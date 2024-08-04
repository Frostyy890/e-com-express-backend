import type { ITokenService, IAuthTokensPayload } from "../interfaces";
import { sign, decode, verify, type JwtPayload } from "jsonwebtoken";
import { settings } from "@config/settings";

export class TokenService implements ITokenService {
  generateAuthTokens(payload: IAuthTokensPayload) {
    const accessToken = sign(payload, settings.jwt.accessToken.secret, {
      expiresIn: settings.jwt.accessToken.expiresIn + "min",
    });
    const refreshToken = sign(payload, settings.jwt.refreshToken.secret, {
      expiresIn: settings.jwt.refreshToken.expiresIn + "d",
    });
    const accessTokenExpiry = new Date();
    accessTokenExpiry.setMinutes(
      accessTokenExpiry.getMinutes() + settings.jwt.accessToken.expiresIn
    );
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + settings.jwt.refreshToken.expiresIn);
    return { accessToken, refreshToken, accessTokenExpiry, refreshTokenExpiry };
  }
  verifyToken(token: string, secret: string) {
    return verify(token, secret) as JwtPayload;
  }
  decodeToken(token: string) {
    return decode(token) as JwtPayload | null;
  }
}
