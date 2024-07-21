import { HttpStatusCodes } from "../constants";
const getErrorByStatusCode = (statusCode: number) => {
  const error =
    Object.keys(HttpStatusCodes).find(
      (key) => HttpStatusCodes[key as keyof typeof HttpStatusCodes] === statusCode
    ) || "INTERNAL_SERVER_ERROR";
  const formatedError = error
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return formatedError;
};

export abstract class CustomError extends Error {
  abstract readonly statusCode: number;
  abstract readonly errors: string[];
  abstract readonly isLogging: boolean;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export class HttpException extends CustomError {
  _statusCode: number;
  _isLogging: boolean;
  _errors: string[];
  constructor(
    statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR,
    errors?: string | string[],
    isLogging = false
  ) {
    super("");
    this._statusCode = statusCode;
    this._isLogging = isLogging;
    if (!errors) this._errors = [getErrorByStatusCode(this._statusCode)];
    else this._errors = Array.isArray(errors) ? errors : [errors];
    Object.setPrototypeOf(this, HttpException.prototype);
  }
  get statusCode() {
    return this._statusCode;
  }
  get errors() {
    return this._errors;
  }
  get isLogging() {
    return this._isLogging;
  }
}
