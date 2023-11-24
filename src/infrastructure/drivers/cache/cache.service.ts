import { ICacheService } from '@domain/adapters/cache.interface';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

export class CacheService implements ICacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get(key: string): Promise<any> {
    return await this.cacheManager.get(key);
  }

  /**
   * Set a value to cache
   *
   * @param key key of value to be cached
   * @param value value to be cached
   * @param ttl time to live in seconds
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl * 1000);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
}
