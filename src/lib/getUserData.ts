import { getUser } from "@/lib/getStats";
import { getStatsCached } from "@/lib/getStats";
import { BWStatsData } from "@/types";
import { cache } from "react";
import { unstable_cache } from "next/cache";

throw new Error("don't use anything here");

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
    const data = await getStatsCached(user);

    return data;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    throw new Error(message);
  }
}

// Use Next.js data cache for cross-request caching (production only)
const getCachedUserData = unstable_cache(fetchUserData, ["user-data"], {
  revalidate: 300, // Cache for 5 minutes
  tags: ["user-stats"],
});
