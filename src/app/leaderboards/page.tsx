"use client";

import { useState, useEffect } from "react";
import { BWLeaderboardsData } from "@/types";
import { FRIENDLY_LB_NAMES, LB_ORDER } from "@/lib/constants";
import { chunk } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trophy, Medal, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LeaderboardsPage() {
  const [data, setData] = useState<BWLeaderboardsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("level");
  const [backgroundImageIndex] = useState(() => Math.floor(Math.random() * 14) + 1);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/leaderboards");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch leaderboard data");
      }

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-4 h-4 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-4 h-4 text-gray-400" />;
    if (rank === 3) return <Award className="w-4 h-4 text-amber-600" />;
    return null;
  };

  const getStatValue = (entry: { username: string; [key: string]: string | number }, activeTab: string) => {
    if (activeTab === "level") return entry.level;
    if (activeTab === "totalWins") return entry.totalWins;
    if (activeTab === "totalFinals") return entry.totalFinals;
    // Add other mappings as needed based on your data structure
    return entry[activeTab] || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p>Loading leaderboards...</p>
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

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="max-w-md border-yellow-200 bg-yellow-50">
          <CardContent className="py-6">
            <p className="text-yellow-800">No leaderboard data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Background with overlay */}
      <div
        className="min-h-screen leaderboard-bg-overlay"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), url(/bgimg/${backgroundImageIndex}.jpeg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="container mx-auto py-8 px-4">
          <Card className="stats-container bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl mb-2">Bedwars Leaderboards</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    Updated {new Date(data.time).toLocaleString()}
                    {data.cached && (
                      <Badge variant="secondary" className="ml-2">
                        Cached
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Tab Navigation */}
              <div className="border-b bg-gray-50">
                <nav className="flex flex-wrap">
                  {LB_ORDER.map((lbKey) => (
                    <button
                      key={lbKey}
                      onClick={() => setActiveTab(lbKey)}
                      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === lbKey ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {FRIENDLY_LB_NAMES[lbKey as keyof typeof FRIENDLY_LB_NAMES]}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {data.stats[activeTab] && (
                  <div className="space-y-6">
                    {chunk(data.stats[activeTab], 25).map((chunk, chunkIndex) => (
                      <div key={chunkIndex} className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-2">Rank</th>
                              <th className="text-left py-3 px-2">Player</th>
                              <th className="text-right py-3 px-2">{FRIENDLY_LB_NAMES[activeTab as keyof typeof FRIENDLY_LB_NAMES]}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {chunk.map((entry, entryIndex) => {
                              const rank = chunkIndex * 25 + entryIndex + 1;
                              return (
                                <tr key={entryIndex} className="border-b hover:bg-gray-50 transition-colors">
                                  <td className="py-3 px-2">
                                    <div className="flex items-center gap-2">
                                      {getRankIcon(rank)}
                                      <span className="font-mono text-sm">{rank}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-2">
                                    <div className="flex items-center gap-3">
                                      <Image src={`https://minotar.net/avatar/${entry.username}/24.png`} alt={`${entry.username} avatar`} width={24} height={24} className="rounded" />
                                      <Link href={`/user/${entry.username}`} className="font-medium text-blue-600 hover:text-blue-800 hover:underline">
                                        {entry.username}
                                      </Link>
                                    </div>
                                  </td>
                                  <td className="py-3 px-2 text-right font-mono">{getStatValue(entry, activeTab).toLocaleString()}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
