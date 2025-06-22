import { BWLeaderboardsData } from "@/types";
import { getUser } from "./getStats";
import { getStatsCached } from "./getStats";
import { redisCache } from "./redis";

async function getLeaderboards(): Promise<BWLeaderboardsData> {
  const key = process.env.HYPIXEL_API_KEY;

  if (!key) {
    throw new Error("Hypixel API key not configured");
  }

  const hypixelTimeStart = Date.now();

  try {
    const response = await fetch(`https://api.hypixel.net/leaderboards?key=${key}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const headers = {
      remaining: response.headers.get("ratelimit-remaining"),
      limit: response.headers.get("ratelimit-limit"),
      reset: response.headers.get("ratelimit-reset"),
    };

    console.log(`Got Hypixel Leaderboards Data after ${(Date.now() - hypixelTimeStart) / 1000}s`);
    console.log(`Hypixel API Rate Limit: ${headers.remaining}/${headers.limit} remaining, resets in ${headers.reset}s`);

    interface LeaderboardEntry {
      path: string;
      prefix: string;
      title: string;
      location: string;
      count: number;
      leaders: string[];
    }

    const leaderboards: LeaderboardEntry[] = data.leaderboards.BEDWARS;

    const processedLeaderboards = Object.fromEntries(
      leaderboards.map((board) => {
        const { path, ...rest } = board;
        return [path, rest];
      })
    );

    // Get player details for top leaderboards
    const leaderboardStats: BWLeaderboardsData["stats"] = {};

    for (const [key, board] of Object.entries(processedLeaderboards)) {
      const typedBoard = board as { leaders: string[] };
      const uuids = typedBoard.leaders;
      const players = await Promise.all(
        uuids.map(async (uuid: string, i) => {
          try {
            const user = await getUser(uuid);
            if (i < 20) {
              const stats = await getStatsCached(user.username);
              return {
                uuid: stats.uuid,
                username: stats.username,
                level: stats.stats.level,
                levelFormatted: stats.stats.levelFormatted,
                totalWins: stats.stats.modes.total.wins,
                totalFinals: stats.stats.modes.total.finalKills,
                totalFinalsFormatted: stats.stats.modes.total.finalKills.toLocaleString(),
              };
            }
            return {
              uuid: user.uuid,
              username: user.username,
            };
          } catch (error) {
            console.error(`Error fetching player ${uuid}:`, error);
            return null;
          }
        })
      );

      leaderboardStats[key] = players.filter((player) => player !== null);
    }

    return {
      cached: false,
      time: new Date(),
      stats: leaderboardStats,
    };
  } catch (error) {
    console.error("Error fetching leaderboards:", error);
    throw new Error("Failed to fetch leaderboards");
  }
}

export async function getLeaderboardsCached(): Promise<BWLeaderboardsData> {
  try {
    const cacheKey = "leaderboards";

    // // During build time, return empty data to avoid external API calls
    // if (process.env.NODE_ENV === "production" && process.env.NEXT_PHASE === "phase-production-build") {
    //   console.log("Build time detected - returning empty leaderboard data");
    //   return {
    //     stats: {
    //       bedwars_level: [],
    //       wins_new: [],
    //       final_kills_new: [],
    //     },
    //     cached: false,
    //     time: new Date(),
    //   };
    // }

    // Try Redis cache first
    const cachedData = await redisCache.get<BWLeaderboardsData>(cacheKey);
    if (cachedData) {
      console.log("Cache HIT for leaderboards (Redis)");
      return { ...cachedData, cached: true };
    }

    console.log("Cache MISS for leaderboards - fetching fresh data");

    // No cached data found, fetch fresh data
    const data = await getLeaderboards();

    // Cache in Redis with 4 hour TTL (don't await to avoid blocking the response)
    redisCache.set(cacheKey, data, 14400).catch((error) => {
      console.error("Failed to cache leaderboards in Redis:", error);
    });
    return data;
  } catch (error) {
    console.error("Error in getLeaderboardsCached:", error);
    throw error;
  }
}
