import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

let redisClient: RedisClientType | null = null;

export async function getRedisClient(): Promise<RedisClientType> {
  if (!redisClient) {
    redisClient = createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
      password: process.env.REDIS_PASSWORD || undefined,
    });

    redisClient.on('error', (err) => {
      console.error('❌ Redis 连接错误:', err);
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis 已连接');
    });

    await redisClient.connect();
  }

  return redisClient;
}

export async function cacheGet<T = any>(key: string): Promise<T | null> {
  try {
    const client = await getRedisClient();
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Redis GET 错误:', error);
    return null;
  }
}

export async function cacheSet(
  key: string,
  value: any,
  ttl: number = 3600
): Promise<void> {
  try {
    const client = await getRedisClient();
    await client.setEx(key, ttl, JSON.stringify(value));
  } catch (error) {
    console.error('Redis SET 错误:', error);
  }
}

export async function cacheDel(pattern: string): Promise<void> {
  try {
    const client = await getRedisClient();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
    }
  } catch (error) {
    console.error('Redis DEL 错误:', error);
  }
}

export async function closeRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    console.log('✅ Redis 连接已关闭');
  }
}
