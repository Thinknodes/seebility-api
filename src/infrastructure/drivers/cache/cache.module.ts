import { EnvironmentConfigService } from '@infrastructure/config/environment-config/environment-config.service';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheService } from './cache.service';
import { EnvironmentConfigModule } from '@infrastructure/config/environment-config/environment-config.module';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [EnvironmentConfigModule],
      useFactory: async (config: EnvironmentConfigService) => {
        const store = await redisStore({
          ttl: 5000,
          url: config.getRedisConnectionUrl(),
        });
        store.client.on('error', (error) => {
          console.error(error);
        });
        store.client.on('connect', () => {
          console.log('Redis connected');
        });
        store.client.on('ready', () => {
          console.log('Redis ready');
        });
        store.client.on('reconnecting', () => {
          console.log('Redis reconnecting');
        });
        return {
          store,
        };
      },
      inject: [EnvironmentConfigService],
    }),
  ],
  exports: [CacheModule, CacheService],
  providers: [CacheService],
})
export class CachingModule {}
