import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { BWStatsData } from "@/types";
import { FRIENDLY_EXTRA_MODE_NAMES, FRIENDLY_MODE_NAMES, FRIENDLY_STAT_NAMES } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function getClientIP(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIP = req.headers.get("x-real-ip");
  const cfConnectingIP = req.headers.get("cf-connecting-ip");

  let ip = cfConnectingIP || forwarded || realIP || "unknown";

  if (typeof ip === "string" && ip.startsWith("::ffff:")) {
    ip = ip.substring(7);
  }

  return ip;
}

const { total: _, ...allModesExceptOverallFriendlyNames } = { ...FRIENDLY_MODE_NAMES, ...FRIENDLY_EXTRA_MODE_NAMES };

export const generateSummary = (data: BWStatsData): string => {
  // Extract relevant information from the data object
  const { coinsFormatted, modes, levelFormatted } = data.stats;
  const { fkdr } = modes.total;

  // Determine the Bedwars mode that the player has played the most
  const mostPlayedMode = Object.entries(modes).sort((a, b) => (a[0] === "total" ? 1 : b[0] === "total" ? -1 : b[1].gamesPlayed - a[1].gamesPlayed))[0][0];
  const mostPlayedModeFriendlyName = (allModesExceptOverallFriendlyNames as Record<string, string>)[mostPlayedMode];

  // Generate a string summarizing the player's statistics in various Bedwars modes
  const statsInfo = FRIENDLY_STAT_NAMES.map((statGroup) => {
    return Object.entries(statGroup)
      .map(([stat, friendlyName]) => `${friendlyName}: ${modes.total[stat as keyof typeof modes.total]}`)
      .join(", ");
  }).join(" / ");

  // Generate a string summarizing the number of Bedwars challenges the player has completed
  const numChallenges = data.stats.challenges.length;
  const challengesInfo = numChallenges === 0 ? "" : `This player has completed ${numChallenges} challenges!`;

  // Generate a summary essay with all the information
  return `Minecraft player ${data.username} is an experienced Bedwars player with ${levelFormatted} stars and ${coinsFormatted} coins. With an impressive win/loss ratio of ${fkdr.toFixed(
    2
  )}, they are a formidable opponent in any Bedwars match. ${challengesInfo} Their preferred mode is ${mostPlayedModeFriendlyName}, which they have played ${
    modes[mostPlayedMode as keyof typeof modes].gamesPlayed
  } times. 

  In terms of Bedwars leaderboards, they rank highly. Their lifetime stats in Bedwars include ${statsInfo}. 

  Additionally, they have collected a total of ${data.stats.modes.total.resourcesCollected} resources, with ${data.stats.modes.total.itemsPurchased} items purchased, ${
    data.stats.modes.total.bedsBroken
  } beds broken, and ${data.stats.modes.total.bedsLost} beds lost. They have also acquired ${data.stats.modes.total.ironCollected} iron. 

  Overall, this Bedwars player is a force to be reckoned with and has put in a significant time and effort to become one of the best. Their stats and leaderboard rankings are a testament to their skill and dedication to the game. Good luck facing them in the Bedwars arena!`;
};

export { allModesExceptOverallFriendlyNames };
