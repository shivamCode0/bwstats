import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/getUser";
import { getStatsCached } from "@/lib/getStats";
import { getClientIP } from "@/lib/utils";

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  try {
    const { username } = params;

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const ip = getClientIP(request);
    const user = await getUser(username);
    const data = await getStatsCached(user, { ip });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    const message = error instanceof Error ? error.message : "Internal server error";

    if (message.includes("Player Not Found")) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    if (message.includes("never played Bedwars")) {
      return NextResponse.json({ error: "This player has never played Bedwars" }, { status: 404 });
    }

    if (message.includes("rate-limited")) {
      return NextResponse.json({ error: "API rate limited, please try again later" }, { status: 429 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
