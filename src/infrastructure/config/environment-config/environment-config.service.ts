import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JWTConfig } from '../../../domain/config/jwt.interface';
import { RedisConfig } from '@domain/config/redis.interface';
import {
  Environment,
  EnvironmentConfig,
} from '@domain/config/environment.interface';
import { MailConfig } from '@domain/config/mail.interface';
import { FirebaseConfig } from '@domain/config/firebase.interface';

@Injectable()
export class EnvironmentConfigService
  implements
    JWTConfig,
    RedisConfig,
    EnvironmentConfig,
    MailConfig,
    FirebaseConfig
{
  constructor(private configService: ConfigService) {}

  getFirebaseServiceAccount() {
    const serviceKey = this.configService.get<string>(
      'FIREBASE_SERVICE_ACCOUNT',
    );
    return JSON.parse(serviceKey);
  }

  getResetPasswordUrl(): string {
    return this.configService.get<string>('RESET_PASSWORD_URL');
  }

  getFrontendUrls(): string {
    return this.configService.get<string>('FRONTEND_URLS');
  }

  getMailHost(): string {
    return this.configService.get<string>('MAIL_HOST');
  }

  getMailUseSSL(): boolean {
    return this.configService.get<boolean>('MAIL_USE_SSL');
  }

  getMailPort(): number {
    return this.configService.get<number>('MAIL_PORT');
  }

  getMailUser(): string {
    return this.configService.get<string>('MAIL_USER');
  }

  getMailPassword(): string {
    return this.configService.get<string>('MAIL_PASSWORD');
  }

  getMailFrom(): string {
    return this.configService.get<string>('MAIL_FROM');
  }

  getEnvironment(): Environment {
    return this.configService.get<Environment>('NODE_ENV');
  }

  isDevelopment(): boolean {
    return this.getEnvironment() === Environment.Development;
  }

  getApiKey(): string {
    return this.configService.get<string>('API_KEY');
  }

  getAppName(): string {
    return this.configService.get<string>('APP_NAME');
  }

  getPort(): number {
    return this.configService.get<number>('PORT');
  }

  getDefaultAdmin() {
    return {
      username: this.configService.get<string>('DEFAULT_ADMIN_USERNAME'),
      password: this.configService.get<string>('DEFAULT_ADMIN_PASSWORD'),
    };
  }

  getSwaggerRoute(): string {
    return this.configService.get<string>('SWAGGER_ROUTE');
  }

  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  getJwtExpirationTime(): string {
    return this.configService.get<string>('JWT_EXPIRATION_TIME');
  }

  getJwtRefreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET');
  }

  getJwtRefreshExpirationTime(): string {
    return this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME');
  }

  getResetPasswordSecret(): string {
    return this.configService.get<string>('RESET_PASSWORD_SECRET');
  }

  getResetPasswordExpirationTime(): string {
    return this.configService.get<string>('RESET_PASSWORD_EXPIRATION_TIME');
  }

  getRedisHost(): string {
    return this.configService.get<string>('REDIS_HOST');
  }

  getRedisPort(): number {
    return this.configService.get<number>('REDIS_PORT');
  }

  getRedisPassword(): string {
    return this.configService.get<string>('REDIS_PASSWORD');
  }

  getRedisDB(): number {
    return this.configService.get<number>('REDIS_DB');
  }

  getRedisSSL(): boolean {
    return this.configService.get<boolean>('REDIS_SSL');
  }

  getRedisURL(): string {
    return this.configService.get<string>('REDIS_URL');
  }

  getRedisConnectionUrl(): string {
    const redisHost = this.getRedisHost();
    const redisPort = this.getRedisPort();
    const redisPassword = this.getRedisPassword();
    const redisDB = this.getRedisDB();
    const redisSSL = this.getRedisSSL();
    const protocol = redisSSL ? 'rediss' : 'redis';
    const redisURL = this.getRedisURL();

    if (redisURL) {
      return redisURL;
    }

    if (redisPassword) {
      return `${protocol}://${redisPassword}@${redisHost}:${redisPort}/${redisDB}`;
    }
    return `${protocol}://${redisHost}:${redisPort}/${redisDB}`;
  }
}
