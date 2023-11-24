export enum TokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
  RESET = 'reset',
}

export interface IJwtServicePayload {
  [key: string]: any;
  type: TokenType;
}

export interface IJwtLoginPayload extends IJwtServicePayload {
  email: string;
  id: string;
}

export interface IJwtService {
  validateToken<T extends object = IJwtServicePayload>(
    token: string,
    secret?: string,
  ): Promise<T>;
  signPayload(
    payload: IJwtServicePayload,
    secret?: string,
    expiresIn?: string,
  ): Promise<string>;
}
