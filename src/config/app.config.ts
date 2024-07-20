import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export enum ENV {
  DEV = "development",
  PROD = "production",
  TEST = "test",
}

interface IAppConfig {
  port: number;
  env: ENV;
  db: {};
}

function getEnvVar(key: string, defaultValue?: string) {
  const value = process.env[key];
  if (!value) {
    if (defaultValue) return defaultValue;
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const appConfig: IAppConfig = {
  port: Number.parseInt(getEnvVar("PORT", "3000")),
  env: getEnvVar("NODE_ENV", ENV.DEV) as ENV,
  db: {},
};
