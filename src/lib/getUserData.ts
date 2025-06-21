import { getUser } from "@/lib/getUser";
import { getStatsCached } from "@/lib/getStats";
import { BWStatsData } from "@/types";
import { cache } from "react";
import { unstable_cache } from "next/cache";

// Simple cached function for development speed
export const getUserData = cache(async (username: string): Promise<BWStatsData> => {
  // In development, skip the unstable_cache to avoid overhead
  if (process.env.NODE_ENV === "development") {
    return await fetchUserData(username);
  }

  // In production, use caching
  return await getCachedUserData(username);
});

// Direct fetch function
async function fetchUserData(username: string): Promise<BWStatsData> {
  try {
    if (!username) {
      throw new Error("Username is required");
    }

    const user = await getUser(username);
    const data = await getStatsCached(user, { ip: "unknown" });

    return data;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    const message = error instanceof Error ? error.message : "Internal server error";

    if (message.includes("Player Not Found")) {
      throw new Error("Player not found");
    }

    if (message.includes("never played Bedwars")) {
      throw new Error("This player has never played Bedwars");
    }

    if (message.includes("rate-limited")) {
      throw new Error("API rate limited, please try again later");
    }

    throw new Error(message);
  }
}

// Use Next.js data cache for cross-request caching (production only)
const getCachedUserData = unstable_cache(fetchUserData, ["user-data"], {
  revalidate: 300, // Cache for 5 minutes
  tags: ["user-stats"],
});
