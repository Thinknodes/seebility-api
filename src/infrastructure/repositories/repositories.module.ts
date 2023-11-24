import { Module } from '@nestjs/common';
import { UserRepositoryImp } from './user.repository';
import { DatabaseModule } from '@infrastructure/drivers/prisma/prisma.module';
import { SpeechRepositoryImp } from './speech.repository';

@Module({
  imports: [DatabaseModule],
  providers: [UserRepositoryImp, SpeechRepositoryImp],
  exports: [UserRepositoryImp, SpeechRepositoryImp],
})
export class RepositoriesModule {}
