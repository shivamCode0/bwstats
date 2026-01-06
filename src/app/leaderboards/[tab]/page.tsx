"use client";

import { useState, useEffect } from "react";
import { BWLeaderboardsData } from "@/types";
import { FRIENDLY_LB_NAMES, LB_ORDER } from "@/lib/constants";
import { chunk } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trophy, Medal, Award, Crown, Star, TrendingUp, Users, Gamepad2 } from "lucide-react";
import Image from "next/image";
import Link from "@/components/Link";
import { minecraft } from "@/app/fonts/fonts";
import clsx from "clsx";
import { useParams } from "next/navigation";

export default function LeaderboardsPage() {
  const [data, setData] = useState<BWLeaderboardsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [activeTab, setActiveTab] = useState("level");
  const { tab: activeTab } = useParams() as { tab: string };
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
      console.log({ result });

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
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return null;
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank <= 3) return "bg-amber-500 text-white";
    if (rank <= 10) return "bg-emerald-500 text-white";
    if (rank <= 20) return "bg-stone-600 text-white";
    if (rank <= 50) return "bg-stone-500 text-white";
    return "bg-stone-400 text-white";
  };

  const getStatIcon = (activeTab: string) => {
    switch (activeTab) {
      case "bedwars_level":
        return <Star className="w-5 h-5 text-blue-500" />;
      case "wins_new":
        return <Crown className="w-5 h-5 text-green-500" />;
      case "wins_1":
        return <Crown className="w-5 h-5 text-emerald-500" />;
      case "final_kills_new":
        return <TrendingUp className="w-5 h-5 text-red-500" />;
      case "final_kills_1":
        return <TrendingUp className="w-5 h-5 text-rose-500" />;
      default:
        return <Gamepad2 className="w-5 h-5 text-purple-500" />;
    }
  };

  const getStatValue = (entry: { username: string; [key: string]: string | number }, activeTab: string) => {
    if (activeTab === "bedwars_level") return entry.level;
    if (activeTab.startsWith("wins_new")) return entry.totalWins;
    if (activeTab.startsWith("final_kills")) return entry.totalFinals;
    // // Add other mappings as needed based on your data structure
    return entry[activeTab];
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
    <div
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), url(/bgimg/${backgroundImageIndex}.jpeg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Background with overlay */}
      <div className="min-h-screen" style={{ backdropFilter: "blur(3px)" }}>
        <div className="mx-auto py-8 px-4" style={{ maxWidth: "1300px" }}>
          <div className="space-y-6">
            {/* Header Section */}
            <Card className="bg-white/75 backdrop-blur-sm">
              <CardHeader className="text-center py-6">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                  <CardTitle className={clsx("text-6xl font-bold tracking-wide", minecraft.className)}>Bedwars Leaderboards</CardTitle>
                  <Trophy className="w-8 h-8 text-yellow-500" />
                </div>
                <p className="text-gray-600 text-lg">Compete with the best players and climb the ranks</p>
                <div className="flex items-center justify-center gap-4 mt-4">
                  <Badge variant="outline" className="text-sm">
                    Updated {new Date(data.time).toLocaleString()}
                  </Badge>
                  {data.cached && (
                    <Badge variant="secondary" className="text-sm">
                      <Users className="w-4 h-4 mr-1" />
                      Cached Data
                    </Badge>
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Stats Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {LB_ORDER.map((lbKey, i) => {
                const isActive = activeTab === lbKey;
                const totalPlayers = data.stats[lbKey]?.length || 0;
                return (
                  <Link href={`/leaderboards/${lbKey}`} className="no-underline group" key={lbKey}>
                    <Card
                      className={`h-full cursor-pointer transition-all duration-300 hover:scale-105 ${
                        isActive ? "bg-amber-50 border-amber-300 shadow-lg" : "bg-white/75 backdrop-blur-sm hover:bg-white/90"
                      }`}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="flex items-center justify-center mb-3">{getStatIcon(lbKey)}</div>
                        <h3 className={`font-semibold text-lg mb-2 ${isActive ? "text-amber-700" : "text-gray-700"}`}>{FRIENDLY_LB_NAMES[lbKey as keyof typeof FRIENDLY_LB_NAMES]}</h3>
                        <p className="text-sm text-gray-600">{totalPlayers.toLocaleString()} players</p>
                        {isActive && <Badge className="mt-2 bg-amber-600 hover:bg-amber-700">Currently Viewing</Badge>}
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {/* Main Leaderboard */}
            <Card className="bg-white/75 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  {getStatIcon(activeTab)}
                  <span>{FRIENDLY_LB_NAMES[activeTab as keyof typeof FRIENDLY_LB_NAMES]} Rankings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.stats[activeTab] && (
                  <div className="space-y-8">
                    {/* Top 3 Podium */}
                    {data.stats[activeTab].length >= 3 && (
                      <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4 text-center">🏆 Top 3 Champions 🏆</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {data.stats[activeTab].slice(0, 3).map((v, i) => {
                            const rank = i + 1;
                            return (
                              <Card
                                key={i}
                                className={`relative overflow-hidden ${
                                  rank === 1
                                    ? "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300"
                                    : rank === 2
                                    ? "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300"
                                    : "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300"
                                }`}
                              >
                                <CardContent className="p-6 text-center">
                                  <div className="absolute top-2 right-2">{getRankIcon(rank)}</div>
                                  <div className="mb-4">
                                    <Image
                                      src={`https://api.mineatar.io/face/${v.uuid}?scale=1&overlay=true`}
                                      alt={`${v.username} avatar`}
                                      width={64}
                                      height={64}
                                      className="mx-auto rounded-lg"
                                      style={{ imageRendering: "pixelated" }}
                                    />
                                  </div>
                                  <Badge className={`${getRankBadgeColor(rank)} mb-2 text-sm font-bold border-0`}>#{rank}</Badge>
                                  <h4 className={clsx("font-bold text-lg mb-2", minecraft.className)}>
                                    <Link href={`/user/${v.username}`} className={`hover:underline ${rank === 1 ? "text-yellow-700" : rank === 2 ? "text-gray-700" : "text-amber-700"}`}>
                                      {v.username}
                                    </Link>
                                  </h4>
                                  <p className="text-2xl font-bold font-mono">{getStatValue(v, activeTab)?.toLocaleString()}</p>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Full Rankings Table */}
                    {chunk(data.stats[activeTab], 50).map((v, i) => (
                      <div key={i}>
                        {i > 0 && <div className="border-t border-gray-200 my-6"></div>}
                        <h3 className="text-lg font-semibold mb-4">
                          Ranks {i * 50 + 1} - {Math.min((i + 1) * 50, data.stats[activeTab].length)}
                        </h3>
                        <div className="grid gap-3">
                          {v.map((entry, entryIndex) => {
                            const rank = i * 50 + entryIndex + 1;
                            const isTopTen = rank <= 10;
                            const isTopHundred = rank <= 100;

                            return (
                              <Card
                                key={entryIndex}
                                className={`transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
                                  isTopTen
                                    ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                                    : isTopHundred
                                    ? "bg-gradient-to-r from-stone-50 to-stone-100 border-stone-200"
                                    : "bg-white hover:bg-gray-50"
                                }`}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                      <div className="flex items-center gap-3">
                                        <Badge className={`${getRankBadgeColor(rank)} min-w-[50px] justify-center font-bold border-0`}>#{rank}</Badge>
                                        {getRankIcon(rank)}
                                      </div>

                                      <div className="flex items-center gap-3">
                                        <Image
                                          src={`https://api.mineatar.io/face/${entry.uuid}?scale=1&overlay=true`}
                                          alt={`${entry.username} avatar`}
                                          width={40}
                                          height={40}
                                          className="rounded"
                                          style={{ imageRendering: "pixelated" }}
                                        />
                                        <div>
                                          <a
                                            href={`/user/${entry.username}`}
                                            className={clsx("font-semibold hover:underline transition-colors", isTopTen ? "text-green-700 text-lg" : isTopHundred ? "text-stone-700" : "text-gray-700")}
                                          >
                                            {entry.username}
                                          </a>
                                          <p className="text-sm text-gray-500">{FRIENDLY_LB_NAMES[activeTab as keyof typeof FRIENDLY_LB_NAMES].split(" - ")[0]}</p>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="text-right">
                                      <div className={clsx("font-bold font-mono", isTopTen ? "text-2xl text-green-600" : isTopHundred ? "text-xl text-stone-700" : "text-lg text-gray-700")}>
                                        {getStatValue(entry, activeTab)?.toLocaleString()}
                                      </div>
                                      {isTopTen && (
                                        <Badge variant="secondary" className="mt-1 text-xs">
                                          Top 10
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Footer */}
            <Card className="bg-white/75 backdrop-blur-sm">
              <CardContent className="text-center py-4">
                <p className="text-sm text-gray-600">Leaderboards are updated regularly • Rankings based on lifetime statistics</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
