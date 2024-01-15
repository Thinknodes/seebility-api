import { Module } from '@nestjs/common';
import { UserRepositoryImp } from './user.repository';
import { DatabaseModule } from '@infrastructure/drivers/prisma/prisma.module';
import { WaitlistRepositoryImp } from './waitlist.repository';
import { CartRepositoryImp } from './cart.repository';

@Module({
  imports: [DatabaseModule],
  providers: [UserRepositoryImp, WaitlistRepositoryImp, CartRepositoryImp],
  exports: [UserRepositoryImp, WaitlistRepositoryImp, CartRepositoryImp],
})
export class RepositoriesModule {}
