import { Injectable } from '@nestjs/common'
import { CacheRepository } from '../cache-repository'
import { RedisService } from './redis-service'

@Injectable()
export class RedisCacheRepository implements CacheRepository {
  constructor(private redisService: RedisService) {}

  async set(key: string, value: string): Promise<void> {
    await this.redisService.set(key, value, 'EX', 60 * 15)
  }

  get(key: string): Promise<string | null> {
    return this.redisService.get(key) // Isso vai dar problema?
  }

  async delete(key: string): Promise<void> {
    await this.redisService.del(key)
  }
}
