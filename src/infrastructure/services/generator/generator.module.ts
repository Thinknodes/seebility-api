import { Module } from '@nestjs/common';
import {
  GeneratorService,
  PromptGenerator,
  TokenCounter,
} from './generator.service';
import { OpenAPIProvider } from './provider';
import { EnvironmentConfigModule } from '@infrastructure/config/environment-config/environment-config.module';

@Module({
  imports: [EnvironmentConfigModule],
  providers: [OpenAPIProvider, GeneratorService, TokenCounter, PromptGenerator],
  exports: [GeneratorService, PromptGenerator, TokenCounter],
})
export class GeneratorServiceModule {}
