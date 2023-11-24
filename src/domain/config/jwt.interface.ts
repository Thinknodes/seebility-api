export interface JWTConfig {
  getJwtSecret(): string;
  getJwtExpirationTime(): string;
  getJwtRefreshSecret(): string;
  getJwtRefreshExpirationTime(): string;
  getResetPasswordSecret(): string;
  getResetPasswordExpirationTime(): string;
}
