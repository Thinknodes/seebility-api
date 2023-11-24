import { EnvironmentConfigService } from '@infrastructure/config/environment-config/environment-config.service';
import OpenAI from 'openai';

export const OPEN_API_PROVIDER = Symbol('OpenAPI');

export const OpenAPIProvider = {
  provide: OPEN_API_PROVIDER,
  useFactory: (env: EnvironmentConfigService) => {
    const openai = new OpenAI({
      apiKey: env.getOpenAIKey(),
    });
    return openai;
  },
  inject: [EnvironmentConfigService],
};
