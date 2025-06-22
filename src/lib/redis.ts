import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

const getRedisClient = () => {
  if (!redis) {
    // Check if Redis environment variables are configured
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      console.warn("Redis not configured - falling back to direct API calls");
      return null;
    }

    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return redis;
};
export const redisCache = {
  async get<T>(key: string): Promise<T | null> {
    // // During build time, skip Redis calls
    // if (process.env.NODE_ENV === "production" && process.env.NEXT_PHASE === "phase-production-build") {
    //   return null;
    // }

    const client = getRedisClient();
    if (!client) return null;

    try {
      const data = await client.get(key);
      console.log(`Redis GET ${data ? "hit" : "miss"} ${key}`);
      return data as T;
    } catch (error) {
      console.error("Redis GET error:", error);
      return null;
    }
  },
  async set(key: string, value: any, ttlSeconds: number): Promise<boolean> {
    const client = getRedisClient();
    if (!client) return false;

    try {
      // Use the native client for writes (not during static generation)
      await client.setex(key, ttlSeconds, JSON.stringify(value));
      console.log(`Redis SET ${key} with TTL ${ttlSeconds}s`);
      return true;
    } catch (error) {
      console.error("Redis SET error:", error);
      return false;
    }
  },

  async del(key: string): Promise<boolean> {
    const client = getRedisClient();
    if (!client) return false;

    try {
      await client.del(key);
      return true;
    } catch (error) {
      console.error("Redis DEL error:", error);
      return false;
    }
  },
};

export default redis;
