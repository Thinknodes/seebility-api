import { Module } from '@nestjs/common';
import { UsecasesProxyModule } from '../usecases-proxy/usecases-proxy.module';
import { LoggerModule } from '@infrastructure/logger/logger.module';
import { EnvironmentConfigModule } from '@infrastructure/config/environment-config/environment-config.module';
import { WaitListController } from './waitlist/waitlist.controller';
import { CartController } from './cart/cart.controller';

@Module({
  imports: [
    UsecasesProxyModule.register(),
    LoggerModule,
    EnvironmentConfigModule,
  ],
  controllers: [WaitListController, CartController],
})
export class ControllersModule {}
