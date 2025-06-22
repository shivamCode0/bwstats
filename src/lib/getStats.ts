import { PlayerUser, BWStatsData } from "@/types";
import { FRIENDLY_EXTRA_MODE_NAMES, FRIENDLY_MODE_NAMES } from "./constants";
import { redisCache } from "./redis";
import React from "react";

export const getUser = React.cache(async (username: string): Promise<PlayerUser> => {
  const playerDBTimeStart = Date.now();

  try {
    const response = await fetch(`https://playerdb.co/api/player/minecraft/${username}`);
    console.log(`Got PlayerDB Data after ${(Date.now() - playerDBTimeStart) / 1000}s`);

    if (!response.ok) {
      throw new Error("Player Not Found");
    }

    const json = await response.json();
    if (json.success === false) {
      throw new Error("Player Not Found");
    }

    return {
      uuid: json.data.player.id,
      username: json.data.player.username,
    };
  } catch (error) {
    console.error("Error fetching player:", error);
    throw new Error("Player Not Found");
  }
});

/**
 * Gets Hypixel Bedwars Stats
 */
async function getStats({ uuid, username }): Promise<BWStatsData> {
  const key = process.env.HYPIXEL_API_KEY;

  if (!key) {
    throw new Error("Hypixel API key not configured");
  }

  console.log(`Getting stats for ${username}`);

  const hypixelTimeStart = Date.now();

  try {
    const response = await fetch(`https://api.hypixel.net/player?uuid=${uuid}&key=${key}`);

    const headers = {
      remaining: response.headers.get("ratelimit-remaining"),
      limit: response.headers.get("ratelimit-limit"),
      reset: response.headers.get("ratelimit-reset"),
    };

    console.log(`Got Hypixel Leaderboards Data after ${(Date.now() - hypixelTimeStart) / 1000}s`);
    console.log(`Hypixel API Rate Limit: ${headers.remaining}/${headers.limit} remaining, resets in ${headers.reset}s`);

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.throttle) {
        throw new Error("The Hypixel API key is being rate-limited");
      } else if (errorData.cause === "Invalid API key") {
        throw new Error("Invalid API Key");
      }
      throw new Error("This player did not ever join Hypixel.");
    }

    const json = await response.json();

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
    throw new Error("This player did not ever join Hypixel.");
  }
}

export const getStatsCached = React.cache(async (username: string, uuid?: string): Promise<BWStatsData> => {
  try {
    // const cacheKey = `user:${user.uuid.toLowerCase()}`;
    const cacheKey = `user:${username}`;

    // Try Redis cache first
    const cachedData = await redisCache.get<BWStatsData>(cacheKey);
    if (cachedData && (!uuid || cachedData.uuid === uuid)) return { ...cachedData, cached: true };

    // No cached data found, fetch fresh data
    const user = await getUser(username);
    const data = await getStats(user);

    // Cache in Redis with 5 minute TTL (don't await to avoid blocking the response)
    const setPromise = redisCache.set(cacheKey, data, 300).catch((error) => console.error("Failed to cache user data in Redis:", error));

    if (process.env.NEXT_PHASE === "phase-production-build") await setPromise; // Ensure cache is set before returning in production

    return data;
  } catch (error) {
    console.error("Error in getStatsCached:", error);
    throw error;
  }
});
