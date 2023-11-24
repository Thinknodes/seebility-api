import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JWTConfig } from '../../../domain/config/jwt.interface';
import { RedisConfig } from '@domain/config/redis.interface';
import {
  Environment,
  EnvironmentConfig,
} from '@domain/config/environment.interface';
import { MailConfig } from '@domain/config/mail.interface';
import { OpenAiConfig } from '@domain/config/openai.interface';
import { FirebaseConfig } from '@domain/config/firebase.interface';

@Injectable()
export class EnvironmentConfigService
  implements
    JWTConfig,
    RedisConfig,
    EnvironmentConfig,
    MailConfig,
    OpenAiConfig,
    FirebaseConfig
{
  constructor(private configService: ConfigService) {}

  getFirebaseServiceAccount() {
    // let json = this.configService.get<string>('FIREBASE_SERVICE_ACCOUNT');
    return {
      type: 'service_account',
      projectId: 'scodes-77f2e',
      privateKeyId: 'acbd5ee83f4ababa092d16318a96ba58f4540b43',
      privateKey:
        '-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDskomwF7WfF23g\nfmVB67m5/lDOQTZamgxXjcH1sHfLGq5W/zFSh7NlAYE3FVVxTzF/z+eZttLKqzFy\n1kfy6KeN1VmvqVgbIQgBS6nPPFPERVhYD54JDWVr/3pkBUYnmTBsaAasjNXXK2i8\n07P/fuqHvRtROaABJ6R2fBREVHg9FzwuUM4yQBmUUdcaAN21RVvI8qXrwpIpiOIF\nd1VH1NpuxTFqS6oB/hsrfPC9BADJ7wLY071gb3y7u1bF+MRep0m00HAmAea4i5J/\nJsyNFdAuV+x4pl2gV373A6T/EoAJClcC9VedMztOfcp+/3TapxbRPJ8kcCN8xRl8\nnjM86nbfAgMBAAECggEAdITsah4TZ4tro/G9P82xyYkYFa6K7e8H+yuoB7HmHtRC\nYDkK+wI5eptWIGJSlh+SWsh04wHoKshM76nZACxVMoeNx/ZZnesT/UdeGOM2wuoA\nzEbM6Np/RMUtbAwo9KH/9rT57IzlWjhYOwDum/3P2BFtXgFK7Kaw22bbuJf+LN/N\naVZ2RxQcx4kvKV7CXjQ4CVdiFxHKOo/P/RxkXPsUQCCwvzLlStr6wgglHxa+Ug6V\nlUp8WF2dgm9ypzz1LaqMm10BIQ6qc7JOnRmHo+xI6bGMpyNlsJokJDLGbihb3VPX\nUJ/LeNrq3fz/M/m7YtNuEG5p1DSVdvthj4iysxY6CQKBgQD2PUfMlAqYGY72N0Ui\nu2GYpfWgDzGaFRH4SeZpipRGivJ1dOgiseKZmUnGqm5+J/xEvWIKcUwpMkZSY0PB\nAf5NFnnUPxMU4/+W+aLsqj6ycexS3ENWfD1q2jeIrZPPAZ7QUjQAingvWuE2IFoe\nu0wzQ9xm1Va3Bh8qHcLFbxdEDQKBgQD18yliE6FPnPWZQfvGKrceGV9zBKxuZcVy\nqNKNhpTVT1WUEz5MGGAMMcLvAno/qoOocvPe9aAwzq2MLBUbpCq1p2gHd750CYDG\nFIn7vlvlUvPBEcFPrTY4IbkYarl/pWObJfr0/r3nbD+5P5bR8UUy6NKe1Yoz+bb1\nUcDZzNWPmwKBgQCPHxc4ZWOy/EgH/CAHC/qyCuQ1YB9oe46yTeHKvm1ogyJh+s1i\nPRqERICJJE6MrRkHqzvs7eVinIIbKO8co9f3XnT5VJ/2qH7Kddao0FsYxPajQrsw\n7Y2VKbjVjG45B6wTUXRATDuG6r+0AiHfcuXbdjoI2z9Hqhs7E4k90FApkQKBgQCg\nCjNSe32LBZKWwGXppB/1+QKwIElnqNebbZlcuEceqnoAWak+8NmG9dZnmlAcH4N+\nWBaybVhoigRJ4uF1VBTqkV1TBqsqbIib2/+RjWPUzG6KolgM1aQjUGZWKhQ8qE0x\nRryPMTg3X6vzihpE0F976h4rdr5wZbyU0zbPQsdwowKBgQDx03QtZ7e1blf7PWMd\nw+PcULRfm1KOQU2wbvf/TcU0e1RrKKmZV4jx/lNKB6I0w6yfbYkGXF3yvSAXqoZA\nbPM7KZS7Fw7+uwBLkkJOu7zlyehVVDsVGOnycw+03lnS8S8AVWqiw5rOC20kKrTo\ngck1w2NnajPA0fbbgNbXXsOEIA==\n-----END PRIVATE KEY-----\n',
      clientEmail:
        'firebase-adminsdk-wvlqw@scodes-77f2e.iam.gserviceaccount.com',
      clientId: '112724904240744209410',
      authUri: 'https://accounts.google.com/o/oauth2/auth',
      tokenUri: 'https://oauth2.googleapis.com/token',
      authProviderX509CertUrl: 'https://www.googleapis.com/oauth2/v1/certs',
      clientX509CertUrl:
        'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-wvlqw%40scodes-77f2e.iam.gserviceaccount.com',
      universeDomain: 'googleapis.com',
    };
    // return JSON.parse(json);
  }

  getOpenAIKey(): string {
    return this.configService.get<string>('OPENAI_API_KEY');
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
