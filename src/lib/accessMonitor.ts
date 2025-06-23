import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export interface AccessLog {
  timestamp: string;
  ip: string;
  path: string;
  userAgent: string;
  success: boolean;
}

export class AccessMonitor {
  /**
   * Get daily access count for a specific IP
   */
  static async getDailyAccessCount(ip: string, date?: string): Promise<number> {
    const targetDate = date || new Date().toISOString().split("T")[0];
    const dailyKey = `daily_access:${targetDate}:${ip}`;

    try {
      const count = await redis.get(dailyKey);
      return typeof count === "number" ? count : 0;
    } catch (error) {
      console.error("Failed to get daily access count:", error);
      return 0;
    }
  }

  /**
   * Get top IPs by access count for a specific date
   */
  static async getTopIPsByDate(date?: string, limit: number = 10): Promise<Array<{ ip: string; count: number }>> {
    const targetDate = date || new Date().toISOString().split("T")[0];
    const pattern = `daily_access:${targetDate}:*`;

    try {
      const keys = await redis.keys(pattern);
      const results: Array<{ ip: string; count: number }> = [];

      for (const key of keys) {
        const count = await redis.get(key);
        const ip = key.split(":")[2]; // Extract IP from key
        if (typeof count === "number" && ip) {
          results.push({ ip, count });
        }
      }

      return results.sort((a, b) => b.count - a.count).slice(0, limit);
    } catch (error) {
      console.error("Failed to get top IPs:", error);
      return [];
    }
  }

  /**
   * Check if an IP is potentially suspicious (high frequency access)
   */
  static async isSuspiciousIP(ip: string): Promise<{ suspicious: boolean; count: number; threshold: number }> {
    const count = await this.getDailyAccessCount(ip);
    const threshold = 100; // More than 100 requests per day might be suspicious

    return {
      suspicious: count > threshold,
      count,
      threshold,
    };
  }

  /**
   * Block an IP temporarily (adds to a blocked IPs set)
   */
  static async blockIP(ip: string, durationSeconds: number = 3600): Promise<boolean> {
    try {
      const blockKey = `blocked_ip:${ip}`;
      await redis.setex(blockKey, durationSeconds, "blocked");
      console.log(`Blocked IP ${ip} for ${durationSeconds} seconds`);
      return true;
    } catch (error) {
      console.error("Failed to block IP:", error);
      return false;
    }
  }

  /**
   * Check if an IP is currently blocked
   */
  static async isIPBlocked(ip: string): Promise<boolean> {
    try {
      const blockKey = `blocked_ip:${ip}`;
      const blocked = await redis.get(blockKey);
      return blocked === "blocked";
    } catch (error) {
      console.error("Failed to check if IP is blocked:", error);
      return false;
    }
  }

  /**
   * Unblock an IP
   */
  static async unblockIP(ip: string): Promise<boolean> {
    try {
      const blockKey = `blocked_ip:${ip}`;
      await redis.del(blockKey);
      console.log(`Unblocked IP ${ip}`);
      return true;
    } catch (error) {
      console.error("Failed to unblock IP:", error);
      return false;
    }
  }

  /**
   * Get analytics for the last N days
   */ static async getAnalytics(days: number = 7): Promise<{
    totalRequests: number;
    uniqueIPs: number;
    dailyStats: Array<{ date: string; requests: number; uniqueIPs: number }>;
  }> {
    const analytics = {
      totalRequests: 0,
      uniqueIPs: 0,
      dailyStats: [],
    };

    try {
      const today = new Date();
      const dates = [];

      for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split("T")[0]);
      }

      for (const date of dates) {
        const pattern = `daily_access:${date}:*`;
        const keys = await redis.keys(pattern);

        let dayRequests = 0;
        const dayIPs = new Set<string>();

        for (const key of keys) {
          const count = await redis.get(key);
          if (typeof count === "number") {
            dayRequests += count;
            analytics.totalRequests += count;

            const ip = key.split(":")[2];
            if (ip) {
              dayIPs.add(ip);
            }
          }
        }

        analytics.dailyStats.push({
          date,
          requests: dayRequests,
          uniqueIPs: dayIPs.size,
        });
      }

      analytics.uniqueIPs = analytics.dailyStats.reduce((total, day) => total + day.uniqueIPs, 0);
    } catch (error) {
      console.error("Failed to get analytics:", error);
    }

    return analytics;
  }
}

export default AccessMonitor;
