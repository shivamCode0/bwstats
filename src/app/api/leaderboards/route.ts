import { NextRequest, NextResponse } from "next/server";
import { getLeaderboardsCached } from "@/lib/getLeaderboards";
import { getClientIP } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    const data = await getLeaderboardsCached({ ip });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching leaderboards:", error);
    const message = error instanceof Error ? error.message : "Internal server error";

    if (message.includes("rate-limited")) {
      return NextResponse.json({ error: "API rate limited, please try again later" }, { status: 429 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
