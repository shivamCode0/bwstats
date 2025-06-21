"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { BWStatsData } from "@/types";
import { FRIENDLY_MODE_NAMES, FRIENDLY_EXTRA_MODE_NAMES, FRIENDLY_STAT_NAMES, CHALLENGES } from "@/lib/constants";
import { generateSummary } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, Trophy, Target, Sword, Shield, Star } from "lucide-react";
import Image from "next/image";

export default function UserPage() {
  const params = useParams();
  const username = params.username as string;
  const [data, setData] = useState<BWStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backgroundImageIndex] = useState(() => Math.floor(Math.random() * 14) + 1);

  useEffect(() => {
    if (username) {
      fetchUserData(username);
    }
  }, [username]);

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

  const timeFormatted = data?.time ? new Date(data.time).toLocaleTimeString() : "";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p>Loading player stats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="max-w-md border-red-200 bg-red-50">
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="max-w-md border-yellow-200 bg-yellow-50">
          <CardContent className="py-6">
            <p className="text-yellow-800">Player not found or has no Bedwars data</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Background with overlay */}
      <div
        className="min-h-screen"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), url(/bgimg/${backgroundImageIndex}.jpeg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="container mx-auto py-8 px-4">
          <div className="main-content">
            {/* Left sidebar */}
            <div className="leftbar">
              <Card className="bg-white/95 backdrop-blur-sm mb-4">
                <CardHeader className="text-center">
                  <div className="player-img-box">
                    <Image src={`https://minotar.net/body/${data.uuid}/300.png`} alt={`${data.username} skin`} width={200} height={400} className="mx-auto" />
                  </div>
                  <CardTitle className="flex items-center justify-center gap-2">
                    <User className="w-5 h-5" />
                    {data.username}
                  </CardTitle>
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-sm">
                      Level {data.stats.level}
                    </Badge>
                    <p className="text-sm text-muted-foreground">Most Played: {mostPlayedModeName}</p>
                  </div>
                </CardHeader>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      Wins
                    </span>
                    <span className="font-mono">{data.stats.modes.total.wins?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-red-500" />
                      Final Kills
                    </span>
                    <span className="font-mono">{data.stats.modes.total.finalKills?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <Sword className="w-4 h-4 text-blue-500" />
                      Kills
                    </span>
                    <span className="font-mono">{data.stats.modes.total.kills?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      K/D Ratio
                    </span>
                    <span className="font-mono">
                      {data.stats.modes.total.deaths > 0 ? (data.stats.modes.total.kills / data.stats.modes.total.deaths).toFixed(2) : data.stats.modes.total.kills.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main content */}
            <div className="flex-1 space-y-6">
              {/* Summary */}
              {summary && (
                <Card className="bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg">{summary}</p>
                  </CardContent>
                </Card>
              )}{" "}
              {/* Mode Statistics */}
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Mode Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {Object.entries(data.stats.modes).map(([mode, stats]) => {
                    const modeName = mode === "total" ? "Overall" : (allModesExceptOverall as Record<string, string>)[mode] || mode;

                    return (
                      <div key={mode} className="border rounded-lg p-4">
                        <h3 className="font-medium text-lg mb-4">{modeName}</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <tbody>
                              {Object.entries(stats).map(([statKey, value]) => (
                                <tr key={statKey} className="border-b">
                                  <td className="py-2 text-muted-foreground">{FRIENDLY_STAT_NAMES[statKey as keyof typeof FRIENDLY_STAT_NAMES] || statKey}</td>
                                  <td className="py-2 text-right font-mono">{typeof value === "number" ? value.toLocaleString() : String(value)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>{" "}
              {/* Challenges */}
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Challenges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.values(CHALLENGES).map((challenge: any) => {
                      const isCompleted = data.stats.challenges?.[challenge.n] || false;
                      return (
                        <div key={challenge.n} className={`p-4 rounded-lg border-2 ${isCompleted ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"}`} title={formatTitle(challenge)}>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={isCompleted ? "default" : "secondary"} className="text-xs">
                              {challenge.n + 1}
                            </Badge>
                            <span className="font-medium text-sm">{challenge.name}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">{isCompleted ? "✓ Completed" : "○ Not completed"}</div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              {/* Footer info */}
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardContent className="text-center py-4">
                  <p className="text-sm text-muted-foreground">Data updated at {timeFormatted} • Cached for performance</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
