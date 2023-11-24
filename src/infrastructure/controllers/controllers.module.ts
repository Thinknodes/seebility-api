import { Module } from '@nestjs/common';
import { UsecasesProxyModule } from '../usecases-proxy/usecases-proxy.module';
import { AuthController } from './auth/auth.controller';
import { SpeechController } from './speech/speech.controller';
import { LoggerModule } from '@infrastructure/logger/logger.module';
import { EnvironmentConfigModule } from '@infrastructure/config/environment-config/environment-config.module';

@Module({
  imports: [
    UsecasesProxyModule.register(),
    LoggerModule,
    EnvironmentConfigModule,
  ],
  controllers: [AuthController, SpeechController],
})
export class ControllersModule {}
