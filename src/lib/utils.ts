import { BWStatsData } from "@/types";

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

export function generateSummary(data: BWStatsData): string {
  const modes = data.stats.modes;
  const totalStats = modes.total;

  if (!totalStats) return "No stats available";

  const summaryParts = [];

  if (totalStats.gamesPlayed > 0) {
    summaryParts.push(`${totalStats.gamesPlayed} games`);
  }

  if (totalStats.wins > 0) {
    summaryParts.push(`${totalStats.wins} wins`);
  }

  if (totalStats.finalKills > 0) {
    summaryParts.push(`${totalStats.finalKills} final kills`);
  }

  return summaryParts.join(", ") || "New player";
}
