import { NextResponse } from "next/server";
import { getLeaderboardsCached } from "@/lib/getLeaderboards";

export async function GET() {
  try {
    const leaderboardData = await getLeaderboardsCached();

    const preview = {
      level: (leaderboardData.stats.bedwars_level || []).slice(0, 5),
      wins: (leaderboardData.stats.wins_new || []).slice(0, 5),
      finalKills: (leaderboardData.stats.final_kills_new || []).slice(0, 5),
    };

    return NextResponse.json(preview);
  } catch (error) {
    console.error("Failed to fetch leaderboard preview:", error);

    // Return empty data on error instead of failing
    return NextResponse.json({
      level: [],
      wins: [],
      finalKills: [],
    });
  }
}
