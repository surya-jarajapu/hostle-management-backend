import Redis from 'ioredis';
export const clear_redis = async (redis: Redis, cache_key: string) => {
  await redis.del(cache_key);
};

export const clear_redis_all = async (
  redis: Redis,
  cache_key: string,
  id: string,
) => {
  if (id == process.env.MAIN_ORGANISATION_ID || id == '') {
    const pattern = cache_key + '*';
    let cursor = 0;
    const keysToDelete: string[] = [];
    do {
      const [nextCursor, keys] = await redis.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100,
      );
      cursor = Number(nextCursor);
      if (keys.length > 0) {
        keysToDelete.push(...keys);
      }
    } while (cursor !== 0);
    if (keysToDelete.length > 0) {
      await redis.del(...keysToDelete);
    }
  } else {
    await redis.del(cache_key + id);
  }
};

export const redis_save_json = async (
  redis: Redis,
  cache_key: string,
  data: any,
) => {
  await redis.set(cache_key, JSON.stringify(data), 'EX', 7200);
};

export const redis_save_json_per = async (
  redis: Redis,
  cache_key: string,
  data: any,
) => {
  await redis.set(cache_key, JSON.stringify(data));
};

export const redis_save = async (
  redis: Redis,
  cache_key: string,
  data: any,
) => {
  await redis.set(cache_key, data, 'EX', 7200);
};

export const redis_save_per = async (
  redis: Redis,
  cache_key: string,
  data: any,
) => {
  await redis.set(cache_key, data, 'EX', 7200);
};
