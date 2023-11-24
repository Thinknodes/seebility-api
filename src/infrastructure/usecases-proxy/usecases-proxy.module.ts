import { DynamicModule, Module } from '@nestjs/common';
import { LoginUseCases } from '../../usecases/auth/login.usecases';

import { ExceptionsModule } from '../exceptions/exceptions.module';
import { LoggerModule } from '../logger/logger.module';
import { LoggerService } from '../logger/logger.service';

import { BcryptModule } from '../services/bcrypt/bcrypt.module';
import { BcryptService } from '../services/bcrypt/bcrypt.service';
import { JwtServiceModule } from '../services/jwt/jwt.module';
import { JwtTokenService } from '../services/jwt/jwt.service';
import { RepositoriesModule } from '../repositories/repositories.module';

import { UserRepositoryImp } from '../repositories/user.repository';

import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';
import { EnvironmentConfigService } from '../config/environment-config/environment-config.service';
import { UseCaseProxy } from './usecases-proxy';
import { ExceptionsService } from '@infrastructure/exceptions/exceptions.service';
import { RegisterUseCases } from '@usecases/auth/register.usecases';
import { EmailService } from '@infrastructure/services/email/emailer.service';
import { EmailModule } from '@infrastructure/services/email/email.module';
import { CachingModule } from '@infrastructure/drivers/cache/cache.module';
import { CacheService } from '@infrastructure/drivers/cache/cache.service';
import { ForgetPasswordUseCases } from '@usecases/auth/forget-password.usecases';
import { SpeechUseCases } from '@usecases/speech/speech.usecases';
import {
  GeneratorService,
  PromptGenerator,
  TokenCounter,
} from '@infrastructure/services/generator/generator.service';
import { SpeechRepositoryImp } from '@infrastructure/repositories/speech.repository';
import { GetSpeechUseCases } from '@usecases/speech/getSpeech.usecases';
import { GeneratorServiceModule } from '@infrastructure/services/generator/generator.module';
import { ProfileUseCases } from '@usecases/auth/profile.usecases';
import { FirebaseService } from '@infrastructure/services/firebase/firebase.service';
import { FirebaseModule } from '@infrastructure/services/firebase/firebase.module';

@Module({
  imports: [
    LoggerModule,
    JwtServiceModule,
    BcryptModule,
    EnvironmentConfigModule,
    RepositoriesModule,
    ExceptionsModule,
    EmailModule,
    CachingModule,
    GeneratorServiceModule,
    FirebaseModule,
  ],
})
export class UsecasesProxyModule {
  static LOGIN_USECASES_PROXY = Symbol('LoginUseCasesProxy');
  static REGISTER_USECASES_PROXY = Symbol('RegisterUseCasesProxy');
  static FORGOT_PASSWORD_USECASES_PROXY = Symbol('ForgotPasswordUseCasesProxy');
  static SPEECH_USECASES_PROXY = Symbol('SpeechUseCasesProxy');
  static GET_SPEECH_USECASES_PROXY = Symbol('GetSpeechUseCasesProxy');
  static PROFILE_USECASES_PROXY = Symbol('ProfileUseCasesProxy');

  static register(): DynamicModule {
    return {
      module: UsecasesProxyModule,
      providers: [
        {
          inject: [
            JwtTokenService,
            EnvironmentConfigService,
            UserRepositoryImp,
            ExceptionsService,
            BcryptService,
          ],
          provide: UsecasesProxyModule.LOGIN_USECASES_PROXY,
          useFactory: (
            jwtTokenService: JwtTokenService,
            config: EnvironmentConfigService,
            userRepo: UserRepositoryImp,
            exceptions: ExceptionsService,
            bcrypt: BcryptService,
          ) =>
            new UseCaseProxy(
              new LoginUseCases(
                new LoggerService(LoginUseCases.name),
                jwtTokenService,
                config,
                userRepo,
                exceptions,
                bcrypt,
              ),
            ),
        },
        {
          inject: [
            UserRepositoryImp,
            ExceptionsService,
            BcryptService,
            EmailService,
            CacheService,
            EnvironmentConfigService,
            FirebaseService,
            JwtTokenService,
          ],
          provide: UsecasesProxyModule.REGISTER_USECASES_PROXY,
          useFactory: (
            userRepo: UserRepositoryImp,
            exceptions: ExceptionsService,
            bcrypt: BcryptService,
            email: EmailService,
            cache: CacheService,
            config: EnvironmentConfigService,
            firebase: FirebaseService,
            jwtService: JwtTokenService,
          ) =>
            new UseCaseProxy(
              new RegisterUseCases(
                new LoggerService(RegisterUseCases.name),
                userRepo,
                exceptions,
                bcrypt,
                email,
                cache,
                config,
                firebase,
                jwtService,
              ),
            ),
        },
        {
          inject: [
            JwtTokenService,
            UserRepositoryImp,
            ExceptionsService,
            EnvironmentConfigService,
            EmailService,
            BcryptService,
          ],
          provide: UsecasesProxyModule.FORGOT_PASSWORD_USECASES_PROXY,
          useFactory: (
            jwtTokenService: JwtTokenService,
            userRepo: UserRepositoryImp,
            exceptions: ExceptionsService,
            config: EnvironmentConfigService,
            email: EmailService,
            bcrypt: BcryptService,
          ) =>
            new UseCaseProxy(
              new ForgetPasswordUseCases(
                new LoggerService(ForgetPasswordUseCases.name),
                jwtTokenService,
                userRepo,
                exceptions,
                config,
                email,
                bcrypt,
              ),
            ),
        },
        {
          inject: [
            GeneratorService,
            PromptGenerator,
            TokenCounter,
            SpeechRepositoryImp,
            ExceptionsService,
          ],
          provide: UsecasesProxyModule.SPEECH_USECASES_PROXY,
          useFactory: (
            generator: GeneratorService,
            promptGenerator: PromptGenerator,
            tokenCounter: TokenCounter,
            speechRepository: SpeechRepositoryImp,
            exception: ExceptionsService,
          ) =>
            new UseCaseProxy(
              new SpeechUseCases(
                new LoggerService(SpeechUseCases.name),
                generator,
                promptGenerator,
                tokenCounter,
                speechRepository,
                exception,
              ),
            ),
        },
        {
          inject: [SpeechRepositoryImp, ExceptionsService],
          provide: UsecasesProxyModule.GET_SPEECH_USECASES_PROXY,
          useFactory: (
            speechRepository: SpeechRepositoryImp,
            exception: ExceptionsService,
          ) => {
            const logger = new LoggerService(GetSpeechUseCases.name);
            return new UseCaseProxy(
              new GetSpeechUseCases(logger, speechRepository, exception),
            );
          },
        },
        {
          inject: [UserRepositoryImp, ExceptionsService, BcryptService],
          provide: UsecasesProxyModule.PROFILE_USECASES_PROXY,
          useFactory: (
            userRepo: UserRepositoryImp,
            exceptions: ExceptionsService,
            bcrypt: BcryptService,
          ) =>
            new UseCaseProxy(
              new ProfileUseCases(
                new LoggerService(ProfileUseCases.name),
                userRepo,
                exceptions,
                bcrypt,
              ),
            ),
        },
      ],
      exports: [
        UsecasesProxyModule.LOGIN_USECASES_PROXY,
        UsecasesProxyModule.REGISTER_USECASES_PROXY,
        UsecasesProxyModule.FORGOT_PASSWORD_USECASES_PROXY,
        UsecasesProxyModule.SPEECH_USECASES_PROXY,
        UsecasesProxyModule.GET_SPEECH_USECASES_PROXY,
        UsecasesProxyModule.PROFILE_USECASES_PROXY,
      ],
    };
  }
}
