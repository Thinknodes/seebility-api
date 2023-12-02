import { Environment } from '@domain/config/environment.interface';
import { plainToClass } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  validateSync,
} from 'class-validator';

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;
  @IsString()
  APP_NAME: string;
  @IsString()
  DEFAULT_ADMIN_USERNAME: string;
  @IsString()
  DEFAULT_ADMIN_PASSWORD: string;
  @IsString()
  SWAGGER_ROUTE: string;
  @IsNumber()
  PORT: number;
  @IsString()
  API_KEY: string;
  @IsUrl()
  RESET_PASSWORD_URL: string;
  @IsString()
  @IsOptional()
  FRONTEND_URLS: string;

  // mail
  @IsString()
  MAIL_HOST: string;
  @IsNumber()
  MAIL_USE_SSL: number;
  @IsNumber()
  MAIL_PORT: number;
  @IsString()
  MAIL_USER: string;
  @IsString()
  MAIL_PASSWORD: string;
  @IsEmail()
  MAIL_FROM: string;

  // jwt
  @IsString()
  JWT_SECRET: string;
  @IsString()
  JWT_EXPIRATION_TIME: string;
  @IsString()
  JWT_REFRESH_TOKEN_SECRET: string;
  @IsString()
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: string;
  @IsString()
  RESET_PASSWORD_SECRET: string;
  @IsString()
  RESET_PASSWORD_EXPIRATION_TIME: string;

  // redis
  @IsString()
  @IsOptional()
  REDIS_HOST: string;
  @IsString()
  @IsOptional()
  REDIS_PORT: string;
  @IsString()
  @IsOptional()
  REDIS_PASSWORD: string;
  @IsString()
  @IsOptional()
  REDIS_DB: string;
  @IsNumber()
  @IsOptional()
  REDIS_SSL: number;
  @IsString()
  @IsOptional()
  REDIS_URL: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
