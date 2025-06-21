import axios from "axios";
import { connectDB } from "./db";
import UserQuery from "@/models/UserQuery";
import { PlayerUser, BWStatsData } from "@/types";
import { FRIENDLY_EXTRA_MODE_NAMES, FRIENDLY_MODE_NAMES } from "./constants";
import { redisCache } from "./redis";

/**
 * Gets Hypixel Bedwars Stats
 */
export async function getStats({ uuid, username }: PlayerUser): Promise<BWStatsData> {
  const key = process.env.HYPIXEL_API_KEY;

  if (!key) {
    throw new Error("Hypixel API key not configured");
  }

  console.log(`Getting stats for ${username}`);

  const hypixelTimeStart = Date.now();

  try {
    const response = await axios.get("https://api.hypixel.net/player", {
      params: { uuid, key },
    });

    console.log(`Got Hypixel Data after ${(Date.now() - hypixelTimeStart) / 1000}s`);
    console.log(`Hypixel API Rate Limit: ${response.headers["ratelimit-remaining"]}/${response.headers["ratelimit-limit"]} remaining, resets in ${response.headers["ratelimit-reset"]}s`);

    const json = response.data;

    if (!json || json.player === null) {
      throw new Error("This player did not ever join Hypixel.");
    }

    const bwStats = json.player.stats?.Bedwars;
    if (!bwStats || !json.player.achievements) {
      throw new Error("This player has never played Bedwars.");
    }

    // Mode configurations
    // const MODE_NAMES = {
    //   eight_one: "eight_one_",
    //   eight_two: "eight_two_",
    //   four_three: "four_three_",
    //   four_four: "four_four_",
    //   total: "",
    // };

    const MODE_NAMES = Object.fromEntries(Object.keys(FRIENDLY_MODE_NAMES).map((v) => [v, `${v}_`])); // Calculate stats for each mode
    MODE_NAMES["total"] = ""; // Add total mode without prefix

    const EXTRA_MODE_NAMES = Object.fromEntries(Object.keys(FRIENDLY_EXTRA_MODE_NAMES).map((v) => [v, `${v}_`])); // Calculate stats for each mode
    const modes: {
      [key: string]: {
        gamesPlayed: number;
        kills: number;
        deaths: number;
        finalKills: number;
        finalDeaths: number;
        wins: number;
        losses: number;
        winstreak: number;
        itemsPurchased: number;
        bedsBroken: number;
        bedsLost: number;
        ironCollected: number;
        goldCollected: number;
        diamondsCollected: number;
        emeraldsCollected: number;
        resourcesCollected: number;
        kdr: number;
        fkdr: number;
        wlr: number;
        bblr: number;
        resourcesCollected1: number;
      };
    } = {};

    for (const [modeKey, modePrefix] of Object.entries({ ...MODE_NAMES, ...EXTRA_MODE_NAMES })) {
      const modeStats = Object.fromEntries(
        Object.entries({
          gamesPlayed: "games_played_bedwars",
          kills: "kills_bedwars",
          deaths: "deaths_bedwars",
          finalKills: "final_kills_bedwars",
          finalDeaths: "final_deaths_bedwars",
          wins: "wins_bedwars",
          losses: "losses_bedwars",
          winstreak: "winstreak",
          itemsPurchased: "_items_purchased_bedwars",
          bedsBroken: "beds_broken_bedwars",
          bedsLost: "beds_lost_bedwars",
          ironCollected: "iron_resources_collected_bedwars",
          goldCollected: "gold_resources_collected_bedwars",
          diamondsCollected: "diamond_resources_collected_bedwars",
          emeraldsCollected: "emerald_resources_collected_bedwars",
          resourcesCollected: "resources_collected_bedwars",
        }).map((e) => [e[0], bwStats[`${modePrefix}${e[1]}`] || 0])
      ) as Record<string, number>;

      const precision = 100;

      modes[modeKey] = {
        gamesPlayed: modeStats.gamesPlayed,
        kills: modeStats.kills,
        deaths: modeStats.deaths,
        finalKills: modeStats.finalKills,
        finalDeaths: modeStats.finalDeaths,
        wins: modeStats.wins,
        losses: modeStats.losses,
        winstreak: modeStats.winstreak,
        itemsPurchased: modeStats.itemsPurchased,
        bedsBroken: modeStats.bedsBroken,
        bedsLost: modeStats.bedsLost,
        ironCollected: modeStats.ironCollected,
        goldCollected: modeStats.goldCollected,
        diamondsCollected: modeStats.diamondsCollected,
        emeraldsCollected: modeStats.emeraldsCollected,
        resourcesCollected: modeStats.resourcesCollected,
        kdr: Math.round(precision * (modeStats.kills / modeStats.deaths)) / precision,
        fkdr: Math.round(precision * (modeStats.finalKills / modeStats.finalDeaths)) / precision,
        wlr: Math.round(precision * (modeStats.wins / modeStats.losses)) / precision,
        bblr: Math.round(precision * (modeStats.bedsBroken / modeStats.bedsLost)) / precision,
        resourcesCollected1: ["iron", "gold", "diamonds", "emeralds"].reduce((acc, cv) => acc + modeStats[`${cv}Collected`], 0),
      };
    }

    const level = Number(json.player.achievements.bedwars_level) || 0;
    const coins = bwStats.coins || 0;

    // Get completed challenges
    const challenges = Object.entries(bwStats)
      .filter(([k, v]) => k.startsWith("bw_challenge_") && v)
      .map(([k]) => k.replace("bw_challenge_", ""));

    const levelIcon = level < 1000 ? "✫" : level < 2000 ? "✪" : "✩";

    const result: BWStatsData = {
      success: true,
      username,
      cached: false,
      uuid,
      hypixelId: json.player._id,
      time: new Date(),
      stats: {
        level,
        coins,
        levelFormatted: `${level.toLocaleString("en")} ${levelIcon}`,
        coinsFormatted: Number(coins).toLocaleString("en"),
        modes,
        challenges,
      },
      raw_bwstats: bwStats,
    };

    return result;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data;
      if (errorData.throttle) {
        throw new Error("The Hypixel API key is being rate-limited");
      } else if (errorData.cause === "Invalid API key") {
        throw new Error("Invalid API Key");
      }
    }
    throw new Error("This player did not ever join Hypixel.");
  }
}

export async function getStatsCached(user: PlayerUser, { ip = "unknown" }: { ip?: string } = {}): Promise<BWStatsData> {
  try {
    const cacheKey = `user:${user.uuid.toLowerCase()}`;

    // Try Redis cache first
    const cachedData = await redisCache.get<BWStatsData>(cacheKey);
    if (cachedData) {
      console.log(`Cache HIT for ${user.username} (Redis)`);
      return { ...cachedData, cached: true };
    }

    console.log(`Cache MISS for ${user.username} - fetching fresh data`);

    // No cached data found, fetch fresh data
    const data = await getStats(user);

    // Cache in Redis with 5 minute TTL (don't await to avoid blocking the response)
    redisCache.set(cacheKey, data, 300).catch((error) => {
      console.error("Failed to cache user data in Redis:", error);
    }); // Fallback: still save to MongoDB for backup/analytics (optional)
    if (process.env.NODE_ENV !== "development") {
      try {
        await connectDB();
        (UserQuery as any)
          .create({
            ip,
            username: user.username,
            uuid: user.uuid.toLowerCase(),
            data,
            cached: false,
          })
          .catch(console.error);
      } catch (error) {
        console.error("MongoDB fallback error:", error);
      }
    }

    return data;
  } catch (error) {
    console.error("Error in getStatsCached:", error);
    throw error;
  }
}
