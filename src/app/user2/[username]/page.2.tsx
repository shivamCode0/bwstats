"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { BWStatsData } from "@/types";
import { FRIENDLY_MODE_NAMES, FRIENDLY_EXTRA_MODE_NAMES, FRIENDLY_STAT_NAMES, CHALLENGES } from "@/lib/constants";
import { generateSummary } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

export default function UserPage() {
  const params = useParams();
  const username = params.username as string;
  const [data, setData] = useState<BWStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (username) {
      fetchUserData(username);
    }
  }, [username]);

  useEffect(() => {
    // Set random background image on client side
    const randomBgIndex = Math.floor(Math.random() * 14) + 1;
    document.body.style.backgroundImage = `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), url("/bgimg/${randomBgIndex}.jpeg")`;
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
    document.body.style.backdropFilter = "blur(3px)";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundColor = "rgb(230, 230, 230)";

    return () => {
      // Clean up background styles when component unmounts
      document.body.style.backgroundImage = "";
      document.body.style.backgroundPosition = "";
      document.body.style.backgroundRepeat = "";
      document.body.style.backgroundSize = "";
      document.body.style.backdropFilter = "";
      document.body.style.backgroundAttachment = "";
      document.body.style.backgroundColor = "";
    };
  }, []);

  const fetchUserData = async (username: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/user/${encodeURIComponent(username)}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch user data");
      }

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const allModesExceptOverall = { ...FRIENDLY_MODE_NAMES, ...FRIENDLY_EXTRA_MODE_NAMES };

  const mostPlayedMode =
    data && data.success
      ? Object.entries(data.stats.modes)
          .filter(([mode]) => mode !== "total")
          .sort((a, b) => b[1].gamesPlayed - a[1].gamesPlayed)[0]?.[0]
      : undefined;

  const mostPlayedModeName = mostPlayedMode ? (allModesExceptOverall as Record<string, string>)[mostPlayedMode] || mostPlayedMode : "Unknown";

  const summary = data && data.success ? generateSummary(data) : "";

  const formatTitle = (challenge: { n: number; name: string; rules: string[]; reward: string }) => {
    return `Challenge ${challenge.n + 1} - ${challenge.name}\n${challenge.rules.map((r, i) => `${i + 1}. ${r}`).join("\n")}\nReward: ${challenge.reward}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4">Loading user data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data || !data.success) {
    return (
      <div className="container mx-auto py-12">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="py-6">
            <p className="text-yellow-800">User not found or no data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-4 mb-5 pt-1 pb-5 stats-container backdrop-blur-md bg-white/70 rounded-lg">
      <main className="px-4">
        <h1 className="text-center my-6 text-3xl font-bold flex items-center justify-center gap-3">
          <img src={`https://crafatar.com/avatars/${data.uuid}?overlay=true&size=16`} alt="Player Icon" className="h-12 w-12" style={{ imageRendering: "pixelated" }} />
          {data.username}&apos;s Bedwars Stats
        </h1>

        <div className="main-content">
          <div className="leftbar pe-2 max-w-xs">
            <div className="player-img-box flex justify-center items-start p-4 w-full">
              <img
                src={`https://crafatar.com/renders/body/${data.uuid}?overlay&scale=10`}
                alt="Player Skin"
                className="player-img max-w-full h-auto max-w-60"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const src1 = `https://mc-heads.net/body/${data.uuid}/right`;
                  if (target.src !== src1) {
                    target.src = src1;
                  }
                }}
              />
            </div>
            <Alert className="no-mobile bg-blue-50 border-blue-200">
              <AlertDescription>
                Tip! Share your{" "}
                <Link href={`https://bwstats.shivam.pro/user/${data.username}`} className="text-blue-600 hover:underline">
                  stats link
                </Link>{" "}
                with your friends and show them how amazing you are.
              </AlertDescription>
            </Alert>

            {/* Left sidebar quick stats */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Level: {data.stats.levelFormatted}</p>
                <p>Coins: {data.stats.coinsFormatted}</p>
                <p>FKDR: {data.stats.modes.total.fkdr}</p>
                <p>BBLR: {data.stats.modes.total.bblr}</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1 w-full">
            {/* Expanded Quick Stats Row */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Statistics Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{data.stats.levelFormatted}</div>
                    <div className="text-sm text-gray-600">Level</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{data.stats.coinsFormatted}</div>
                    <div className="text-sm text-gray-600">Coins</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{data.stats.modes.total.fkdr}</div>
                    <div className="text-sm text-gray-600">FKDR</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{data.stats.modes.total.bblr}</div>
                    <div className="text-sm text-gray-600">BBLR</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">{data.stats.modes.total.wins?.toLocaleString() || "0"}</div>
                    <div className="text-sm text-gray-600">Wins</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{data.stats.modes.total.finalKills?.toLocaleString() || "0"}</div>
                    <div className="text-sm text-gray-600">Final Kills</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-pink-600">{data.stats.modes.total.kills?.toLocaleString() || "0"}</div>
                    <div className="text-sm text-gray-600">Kills</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-indigo-600">{data.stats.modes.total.kdr || "0"}</div>
                    <div className="text-sm text-gray-600">K/D Ratio</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-teal-600">{data.stats.modes.total.bedsBroken?.toLocaleString() || "0"}</div>
                    <div className="text-sm text-gray-600">Beds Broken</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-cyan-600">{data.stats.modes.total.resourcesCollected?.toLocaleString() || "0"}</div>
                    <div className="text-sm text-gray-600">Resources</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Modes Table */}
            <div className="stats-table-container mb-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 stats-table">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-300 px-3 py-2 text-left"></th>
                      {Object.entries(FRIENDLY_MODE_NAMES).map(([key, name]) => (
                        <th key={key} className="border border-gray-300 px-3 py-2 text-center">
                          {name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {FRIENDLY_STAT_NAMES.map((statGroup, groupIndex) => (
                      <React.Fragment key={groupIndex}>
                        {Object.entries(statGroup).map(([statKey, statName]) => (
                          <tr key={statKey} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-3 py-2 font-medium">{statName}</td>
                            {Object.keys(FRIENDLY_MODE_NAMES).map((modeKey) => (
                              <td key={modeKey} className="border border-gray-300 px-3 py-2 text-center">
                                {(data.stats.modes[modeKey] as any)?.[statKey]?.toLocaleString() || "0"}
                              </td>
                            ))}
                          </tr>
                        ))}
                        <tr>
                          <td colSpan={Object.keys(FRIENDLY_MODE_NAMES).length + 1} className="border-t-2 border-gray-400 h-1"></td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">{summary}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-4">
          {/* Other Modes */}
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-100 hover:bg-gray-200 rounded-lg">
              <span className="font-semibold">Other Modes</span>
              <ChevronDown className="w-5 h-5" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-4 border rounded-b-lg">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 stats-table">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="border border-gray-300 px-3 py-2 text-left"></th>
                        {Object.entries(FRIENDLY_EXTRA_MODE_NAMES).map(([key, name]) => (
                          <th key={key} className="border border-gray-300 px-3 py-2 text-center">
                            {name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {FRIENDLY_STAT_NAMES.map((statGroup, groupIndex) => (
                        <React.Fragment key={groupIndex}>
                          {Object.entries(statGroup).map(([statKey, statName]) => (
                            <tr key={statKey} className="hover:bg-gray-50">
                              <td className="border border-gray-300 px-3 py-2 font-medium">{statName}</td>
                              {Object.keys(FRIENDLY_EXTRA_MODE_NAMES).map((modeKey) => (
                                <td key={modeKey} className="border border-gray-300 px-3 py-2 text-center">
                                  {(data.stats.modes[modeKey] as any)?.[statKey]?.toLocaleString() || "Error"}
                                </td>
                              ))}
                            </tr>
                          ))}
                          <tr>
                            <td colSpan={Object.keys(FRIENDLY_EXTRA_MODE_NAMES).length + 1} className="border-t-2 border-gray-400 h-1"></td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Challenges */}
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-100 hover:bg-gray-200 rounded-lg">
              <span className="font-semibold">Challenges</span>
              <ChevronDown className="w-5 h-5" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-4 border rounded-b-lg">
                <div className="flex flex-wrap justify-around gap-8">
                  {data.stats.challenges && data.stats.challenges.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Completed</h3>
                      <div className="space-y-1">
                        {data.stats.challenges
                          .sort((a: string, b: string) => (CHALLENGES as any)[a]?.n - (CHALLENGES as any)[b]?.n)
                          .map((challengeKey: string) => {
                            const challenge = (CHALLENGES as any)[challengeKey];
                            return challenge ? (
                              <p key={challengeKey} className="text-sm cursor-help border-b border-dotted border-gray-400 w-max" title={formatTitle(challenge)}>
                                {challenge.n + 1}. {challenge.name} ⓘ
                              </p>
                            ) : null;
                          })}
                      </div>
                    </div>
                  )}
                  {(!data.stats.challenges || data.stats.challenges.length < Object.keys(CHALLENGES).length) && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Not Completed</h3>
                      <div className="space-y-1">
                        {Object.entries(CHALLENGES)
                          .filter(([key]) => !data.stats.challenges?.includes(key))
                          .sort(([, a], [, b]) => a.n - b.n)
                          .map(([key, challenge]) => (
                            <p key={key} className="text-sm cursor-help border-b border-dotted border-gray-400 w-max" title={formatTitle(challenge)}>
                              {challenge.n + 1}. {challenge.name} ⓘ
                            </p>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </main>
    </div>
  );
}
