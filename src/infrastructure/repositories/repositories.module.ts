import { Module } from '@nestjs/common';
import { UserRepositoryImp } from './user.repository';
import { DatabaseModule } from '@infrastructure/drivers/prisma/prisma.module';
import { WaitlistRepositoryImp } from './waitlist.repository';

@Module({
  imports: [DatabaseModule],
  providers: [UserRepositoryImp, WaitlistRepositoryImp],
  exports: [UserRepositoryImp, WaitlistRepositoryImp],
})
export class RepositoriesModule {}
