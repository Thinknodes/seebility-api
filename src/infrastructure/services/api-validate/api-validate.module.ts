import { Module } from '@nestjs/common';
import { ApiKeyValidateService } from './api-validate.service';
import { BcryptModule } from '../bcrypt/bcrypt.module';

@Module({
  imports: [BcryptModule],
  providers: [ApiKeyValidateService],
  exports: [ApiKeyValidateService],
})
export class ApiKeyValidateModule {}
