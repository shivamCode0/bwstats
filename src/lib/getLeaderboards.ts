import axios from "axios";
import connectDB from "./db";
import LBQuery from "@/models/LBQuery";
import { BWLeaderboardsData } from "@/types";
import { getUser } from "./getUser";
import { getStatsCached } from "./getStats";

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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { path, location, ...rest } = board;
        return [path, rest];
      })
    );

    // Get player details for top leaderboards
    const leaderboardStats: {
      [key: string]: Array<{
        uuid: string;
        username: string;
        level: number;
        levelFormatted: string;
        totalWins: number;
        totalFinals: number;
        totalFinalsFormatted: string;
      }>;
    } = {};

    for (const [key, board] of Object.entries({
      level: processedLeaderboards.bedwars_level,
      wins: processedLeaderboards.wins_new,
      finalKills: processedLeaderboards.final_kills_new,
    })) {
      const typedBoard = board as { leaders: string[] };
      const uuids = typedBoard.leaders.slice(0, 20);
      const players = await Promise.all(
        uuids.map(async (uuid: string) => {
          try {
            const user = await getUser(uuid);
            const stats = await getStatsCached(user);
            return {
              uuid: stats.uuid,
              username: stats.username,
              level: stats.stats.level,
              levelFormatted: stats.stats.levelFormatted,
              totalWins: stats.stats.modes.total.wins,
              totalFinals: stats.stats.modes.total.finalKills,
              totalFinalsFormatted: stats.stats.modes.total.finalKills.toLocaleString(),
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
  await connectDB();

  try {
    // Check for cached data within the last 4 hours
    const cacheTime = 4; // hours
    const cutoffTime = new Date(Date.now() - cacheTime * 60 * 60 * 1000);

    const cachedQuery = await LBQuery.findOne({
      time: { $gte: cutoffTime },
    })
      .sort({ time: -1 })
      .limit(1);

    if (cachedQuery) {
      return { ...cachedQuery.data, cached: true };
    }

    // No cached data found, fetch fresh data
    console.log("Missed Cache - fetching fresh leaderboards");
    const data = await getLeaderboards();

    // Save to cache (don't await to avoid blocking the response)
    LBQuery.create({ ip, data }).catch(console.error);

    return data;
  } catch (error) {
    console.error("Error in getLeaderboardsCached:", error);
    throw error;
  }
}
