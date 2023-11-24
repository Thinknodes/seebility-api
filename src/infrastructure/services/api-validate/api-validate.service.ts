import { Injectable } from '@nestjs/common';
import { IApiKeyValidateService } from '@domain/adapters/api-key-validate.interface';
import { EnvironmentConfigService } from '@infrastructure/config/environment-config/environment-config.service';
import { BcryptService } from '../bcrypt/bcrypt.service';

@Injectable()
export class ApiKeyValidateService implements IApiKeyValidateService {
  constructor(
    private readonly environment: EnvironmentConfigService,
    private readonly bcrypt: BcryptService,
  ) {}

  async isValid(key: string): Promise<boolean> {
    const hash = await this.bcrypt.hash(this.environment.getApiKey());
    return await this.bcrypt.compare(key, hash);
  }
}
