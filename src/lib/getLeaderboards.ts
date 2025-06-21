import axios from "axios";
import { connectDB } from "./db";
import LBQuery from "@/models/LBQuery";
import { BWLeaderboardsData } from "@/types";
import { getUser } from "./getUser";
import { getStatsCached } from "./getStats";
import React from "react";
import { redisCache } from "./redis";

export async function getLeaderboards(): Promise<BWLeaderboardsData> {
  const key = process.env.HYPIXEL_API_KEY;

  if (!key) {
    throw new Error("Hypixel API key not configured");
  }

  const hypixelTimeStart = Date.now();

  try {
    const response = await axios.get("https://api.hypixel.net/leaderboards", {
      params: { key },
    });

    console.log(`Got Hypixel Leaderboards Data after ${(Date.now() - hypixelTimeStart) / 1000}s`);
    console.log(`Hypixel API Rate Limit: ${response.headers["ratelimit-remaining"]}/${response.headers["ratelimit-limit"]} remaining, resets in ${response.headers["ratelimit-reset"]}s`);
    interface LeaderboardEntry {
      path: string;
      prefix: string;
      title: string;
      location: string;
      count: number;
      leaders: string[];
    }

    const leaderboards: LeaderboardEntry[] = response.data.leaderboards.BEDWARS;

    const processedLeaderboards = Object.fromEntries(
      leaderboards.map((board) => {
        const { path, ...rest } = board;
        return [path, rest];
      })
    );

    // Get player details for top leaderboards
    const leaderboardStats: BWLeaderboardsData["stats"] = {};

    // for (const [key, board] of Object.entries({
    //   level: processedLeaderboards.bedwars_level,
    //   wins: processedLeaderboards.wins_new,
    //   finalKills: processedLeaderboards.final_kills_new,
    // }))

    const getUserCached = React.cache(getUser);
    const getStatsCachedCached = React.cache(getStatsCached);
    for (const [key, board] of Object.entries(processedLeaderboards)) {
      const typedBoard = board as { leaders: string[] };
      const uuids = typedBoard.leaders;
      const players = await Promise.all(
        uuids.map(async (uuid: string, i) => {
          try {
            const user = await getUserCached(uuid);
            if (i < 20) {
              const stats = await getStatsCachedCached(user);
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
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data;
      if (errorData.throttle) {
        throw new Error("The Hypixel API key is being rate-limited");
      } else if (errorData.cause === "Invalid API key") {
        throw new Error("Invalid API Key");
      }
    }
    console.error("Error fetching leaderboards:", error);
    throw new Error("Failed to fetch leaderboards");
  }
}

export async function getLeaderboardsCached({ ip = "unknown" }: { ip?: string } = {}): Promise<BWLeaderboardsData> {
  try {
    const cacheKey = "leaderboards";

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
    }); // Fallback: still save to MongoDB for backup/analytics (optional)
    try {
      await connectDB();
      (LBQuery as any).create({ ip, data }).catch(console.error);
    } catch (error) {
      console.error("MongoDB fallback error:", error);
    }

    return data;
  } catch (error) {
    console.error("Error in getLeaderboardsCached:", error);
    throw error;
  }
}
