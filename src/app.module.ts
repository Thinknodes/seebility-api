import {
  Module,
  ValidationPipe,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { DatabaseModule } from '@infrastructure/drivers/prisma/prisma.module';
import { CachingModule } from '@infrastructure/drivers/cache/cache.module';
import { LoggerModule } from '@infrastructure/logger/logger.module';
import { ExceptionsModule } from '@infrastructure/exceptions/exceptions.module';
import { UsecasesProxyModule } from '@infrastructure/usecases-proxy/usecases-proxy.module';
import { ControllersModule } from '@infrastructure/controllers/controllers.module';
import { BcryptModule } from '@infrastructure/services/bcrypt/bcrypt.module';
import { JwtServiceModule } from '@infrastructure/services/jwt/jwt.module';
import { EnvironmentConfigModule } from '@infrastructure/config/environment-config/environment-config.module';
import { EmailModule } from '@infrastructure/services/email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_PIPE, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { LoggingInterceptor } from '@infrastructure/common/interceptors/logger.interceptor';
import { ResponseInterceptor } from '@infrastructure/common/interceptors/response.interceptor';
import { AllExceptionFilter } from '@infrastructure/common/filter/exception.filter';
import { RepositoriesModule } from '@infrastructure/repositories/repositories.module';
import {
  AuthenticationCookieMiddleware,
  AuthenticationMiddleware,
} from '@infrastructure/middlewares/authentication.middleware';
import { ApiMiddleware } from '@infrastructure/middlewares/apikey.middleware';
import { ApiKeyValidateModule } from '@infrastructure/services/api-validate/api-validate.module';

@Module({
  imports: [
    DatabaseModule,
    CachingModule,
    LoggerModule,
    ExceptionsModule,
    UsecasesProxyModule.register(),
    ControllersModule,
    BcryptModule,
    JwtServiceModule,
    EnvironmentConfigModule,
    EmailModule,
    JwtModule.register({}),
    RepositoriesModule,
    ApiKeyValidateModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
        errorHttpStatusCode: 400,
        stopAtFirstError: false,
      }),
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationCookieMiddleware)
      .exclude(
        {
          path: 'auth/login',
          method: RequestMethod.POST,
        },
        {
          path: 'auth/logout',
          method: RequestMethod.POST,
        },
        {
          path: 'auth/refresh',
          method: RequestMethod.POST,
        },
        {
          path: 'auth/register',
          method: RequestMethod.POST,
        },
        {
          path: 'auth/resend-otp',
          method: RequestMethod.POST,
        },
        {
          path: 'auth/verify-otp',
          method: RequestMethod.POST,
        },
        {
          path: 'auth/forgot-(.*)',
          method: RequestMethod.POST,
        },
        {
          path: 'auth/sign-in/google',
          method: RequestMethod.POST,
        },
      )
      .forRoutes('*')

      .apply(AuthenticationMiddleware)
      .exclude(
        {
          path: 'auth/login',
          method: RequestMethod.POST,
        },
        {
          path: 'auth/logout',
          method: RequestMethod.POST,
        },
        {
          path: 'auth/refresh',
          method: RequestMethod.POST,
        },
        {
          path: 'auth/register',
          method: RequestMethod.POST,
        },
        {
          path: 'auth/resend-otp',
          method: RequestMethod.POST,
        },
        {
          path: 'auth/verify-otp',
          method: RequestMethod.POST,
        },
        {
          path: 'auth/forgot-(.*)',
          method: RequestMethod.POST,
        },
        {
          path: 'auth/sign-in/google',
          method: RequestMethod.POST,
        },
      )
      .forRoutes('*')

      // API Key middleware
      .apply(ApiMiddleware)
      .forRoutes('*');
  }
}
