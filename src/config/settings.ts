import dotenv from "dotenv";
import { CookieOptions } from "express";

dotenv.config({ path: ".env" });

export enum ENV {
  DEV = "development",
  PROD = "production",
  TEST = "test",
}

interface ISettings {
  port: number;
  env: ENV;
  hashing: {
    saltRounds: number;
  };
  jwt: {
    accessToken: {
      secret: string;
      expiresIn: number;
    };
    refreshToken: {
      secret: string;
      expiresIn: number;
      cookieName: string;
      cookieOptions: CookieOptions;
    };
    tokenType: string;
  };
}

function getEnvVar(key: string, defaultValue?: string) {
  const value = process.env[key];
  if (!value) {
    if (defaultValue) return defaultValue;
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const settings: ISettings = {
  port: Number.parseInt(getEnvVar("PORT", "3000")),
  env: getEnvVar("NODE_ENV", ENV.DEV) as ENV,
  hashing: {
    saltRounds: Number.parseInt(getEnvVar("SALT_ROUNDS", "10")),
  },
  jwt: {
    accessToken: {
      secret: getEnvVar("ACCESS_TOKEN_SECRET", "access_token_secret"),
      expiresIn: Number.parseInt(getEnvVar("ACCESS_TOKEN_EXPIRY", "15")),
    },
    refreshToken: {
      secret: getEnvVar("REFRESH_TOKEN_SECRET", "refresh_token_secret"),
      expiresIn: Number.parseInt(getEnvVar("REFRESH_TOKEN_EXPIRY", "1")),
      cookieName: getEnvVar("REFRESH_TOKEN_COOKIE_NAME", "refreshToken"),
      cookieOptions: {
        httpOnly: true,
        sameSite: "none",
        maxAge: Number.parseInt(getEnvVar("COOKIE_MAX_AGE", "86400000")),
        // secure: true, Uncomment this line when deploying to production
      },
    },
    tokenType: getEnvVar("TOKEN_TYPE", "Bearer"),
  },
};
