import type { JwtPayload } from "jsonwebtoken";

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: Date;
  refreshTokenExpiry: Date;
}

export interface IAuthTokensPayload {
  userId: string;
  sessionId: string;
}

export interface ITokenService {
  generateAuthTokens(payload: IAuthTokensPayload): IAuthTokens;
  verifyToken(token: string, secret: string): JwtPayload;
  decodeToken(token: string): JwtPayload | null;
}
