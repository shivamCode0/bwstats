import React, { Suspense } from "react";
import { BWStatsData } from "@/types";
import { FRIENDLY_MODE_NAMES, FRIENDLY_EXTRA_MODE_NAMES, FRIENDLY_STAT_NAMES, CHALLENGES } from "@/lib/constants";
import { generateSummary } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, Trophy, Target, Shield, Star, Swords, Crown, Coins, Zap, Bed, TrendingUp, Gamepad2, Percent } from "lucide-react";
import Image from "next/image";
import { minecraft } from "@/app/fonts/fonts";
import clsx from "clsx";
import { getUserData } from "@/lib/getUserData";
import PlayerSkinView from "@/components/PlayerSkinView";
import { UserPageSkeleton as UserSkeleton } from "@/components/UserPageSkeleton";

interface UserPageProps {
  params: Promise<{
    username: string;
  }>;
}

// Error component
function UserError({ error }: { error: string }) {
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

// Not found component
function UserNotFound() {
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

// Dynamic metadata generation
export async function generateMetadata({ params }: UserPageProps) {
  const { username } = await params;

  try {
    const data = await getUserData(username);

    if (!data || !data.success) {
      return {
        title: `${username} - Player Not Found | BWStats`,
        description: `Player ${username} not found or has no Bedwars data on BWStats.`,
      };
    }

    const stats = data.stats.modes.total;
    const fkdr = stats.finalDeaths > 0 ? (stats.finalKills / stats.finalDeaths).toFixed(2) : stats.finalKills.toFixed(2);
    const bblr = stats.bedsLost > 0 ? (stats.bedsBroken / stats.bedsLost).toFixed(2) : stats.bedsBroken.toFixed(2);
    const winRate = stats.gamesPlayed > 0 ? ((stats.wins / stats.gamesPlayed) * 100).toFixed(1) : "0.0";

    const title = `${data.username} - Level ${data.stats.level} | BWStats`;
    const description = `${data.username}'s Hypixel Bedwars Stats: Level ${
      data.stats.level
    }, ${stats.wins?.toLocaleString()} wins, ${fkdr} FKDR, ${bblr} BBLR, ${winRate}% win rate. View complete statistics and performance analytics.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        images: [
          {
            url: `https://crafatar.com/avatars/${data.uuid}?size=256&overlay`,
            width: 256,
            height: 256,
            alt: `${data.username}'s Minecraft skin`,
          },
        ],
      },
      twitter: {
        card: "summary",
        title,
        description,
        images: [`https://crafatar.com/avatars/${data.uuid}?size=256&overlay`],
      },
    };
  } catch (error) {
    return {
      title: `${username} - Error | BWStats`,
      description: `Error loading player data for ${username} on BWStats.`,
    };
  }
}

// Background wrapper component (server-side with static background)
function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  // Use a consistent background for SSR, client can hydrate with random one if needed
  const backgroundImageIndex = 7; // Fixed for SSR consistency

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
      <div className="min-h-screen" style={{ backdropFilter: "blur(3px)" }}>
        {children}
      </div>
    </div>
  );
}

// Main user content component (server-side)
async function UserContent({ username }: { username: string }) {
  let data: BWStatsData;

  try {
    data = await getUserData(username);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return <UserError error={errorMessage} />;
  }

  if (!data || !data.success) {
    return <UserNotFound />;
  }

  const allModesExceptOverall = { ...FRIENDLY_MODE_NAMES, ...FRIENDLY_EXTRA_MODE_NAMES };

  const mostPlayedMode = Object.entries(data.stats.modes)
    .filter(([mode]) => mode !== "total")
    .sort((a, b) => b[1].gamesPlayed - a[1].gamesPlayed)[0]?.[0];

  const mostPlayedModeName = mostPlayedMode ? (allModesExceptOverall as Record<string, string>)[mostPlayedMode] || mostPlayedMode : "Unknown";

  const summary = generateSummary(data);
  const timeFormatted = data?.time ? new Date(data.time).toLocaleTimeString() : "";

  return (
    <div className="mx-auto py-8 px-4 overflow-x-hidden max-w-[1300px]">
      <div className="main-content gap-3 lg:gap-4 xl:gap-5">
        {/* Left sidebar */}
        <div className="leftbar space-y-3 hidden md:block md:w-[220px] lg:w-[250px] xl:w-[300px]">
          <Card className="bg-white/75 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="">
                <Suspense fallback={<div className="h-[430px] w-[200px] mx-auto bg-gray-200 animate-pulse rounded" />}>
                  <PlayerSkinView uuid={data.uuid} username={data.username} />
                </Suspense>
              </div>
              <CardTitle className="flex items-center justify-center gap-2">
                <User className="w-5 h-5" />
                {data.username}
              </CardTitle>
              <div className="space-y-2 mt-2">
                <Badge variant="outline" className="text-sm">
                  Level {data.stats.level}
                </Badge>
                <p className="text-sm text-muted-foreground">Most Played: {mostPlayedModeName}</p>
              </div>
            </CardHeader>
          </Card>
          {/* Quick Stats - Original 4 important stats */}
          <Card className="bg-white/75 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                {
                  icon: Star,
                  iconColor: "text-yellow-500",
                  label: "Level",
                  value: data.stats.level?.toLocaleString() || 0,
                },
                {
                  icon: Coins,
                  iconColor: "text-yellow-600",
                  label: "Coins",
                  value: data.stats.coins?.toLocaleString() || 0,
                },
                {
                  icon: Target,
                  iconColor: "text-red-500",
                  label: "FKDR",
                  value: data.stats.modes.total.finalDeaths > 0 ? (data.stats.modes.total.finalKills / data.stats.modes.total.finalDeaths).toFixed(2) : data.stats.modes.total.finalKills.toFixed(2),
                },
                {
                  icon: Bed,
                  iconColor: "text-green-500",
                  label: "BBLR",
                  value: data.stats.modes.total.bedsLost > 0 ? (data.stats.modes.total.bedsBroken / data.stats.modes.total.bedsLost).toFixed(2) : data.stats.modes.total.bedsBroken.toFixed(2),
                },
                {
                  icon: Crown,
                  iconColor: "text-purple-500",
                  label: "Wins",
                  value: data.stats.modes.total.wins?.toLocaleString() || 0,
                },
                {
                  icon: Zap,
                  iconColor: "text-orange-500",
                  label: "Final Kills",
                  value: data.stats.modes.total.finalKills?.toLocaleString() || 0,
                },
                {
                  icon: Swords,
                  iconColor: "text-blue-500",
                  label: "Kills",
                  value: data.stats.modes.total.kills?.toLocaleString() || 0,
                },
                {
                  icon: TrendingUp,
                  iconColor: "text-green-600",
                  label: "K/D Ratio",
                  value: data.stats.modes.total.deaths > 0 ? (data.stats.modes.total.kills / data.stats.modes.total.deaths).toFixed(2) : data.stats.modes.total.kills.toFixed(2),
                },
              ].map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="flex justify-between items-center py-1 px-2 rounded hover:bg-gray-50 transition-colors">
                    <span className="flex items-center gap-2">
                      <IconComponent className={`w-4 h-4 ${stat.iconColor}`} />
                      {stat.label}
                    </span>
                    <span className="font-mono font-semibold">{stat.value}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
        {/* Main content */}
        <div className="flex-1 space-y-3 min-w-0 overflow-hidden">
          <Card className="bg-white/75 backdrop-blur-sm mb-3">
            <CardHeader className="text-center py-6">
              <div className="flex items-center justify-center gap-3 lg:gap-4 xl:gap-5 mb-2">
                <Image
                  style={{ imageRendering: "pixelated" }}
                  src={`https://crafatar.com/avatars/${data.uuid}?size=64&overlay`}
                  alt={`${data.username} face`}
                  width={64}
                  height={64}
                  className="rounded-sm"
                />

                <CardTitle
                  className={clsx(
                    "font-bold tracking-wide ml-3",
                    // Base responsive text sizes
                    "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
                    // Dynamic adjustment based on username length
                    data.username.length > 16 && "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl",
                    data.username.length > 12 && data.username.length <= 16 && "text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl",
                    data.username.length > 8 && data.username.length <= 12 && "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
                  )}
                >
                  <span className={clsx(minecraft.className)}>{data.username}</span>
                  <br />
                </CardTitle>
              </div>
              <p className="text-gray-600">Complete Hypixel Bedwars Statistics and Performance Overview</p>
            </CardHeader>
          </Card>
          {/* Comprehensive Quick Stats */}
          <Card className="bg-white/75 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Comprehensive Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 lg:gap-4 xl:gap-4">
                {[
                  {
                    icon: Star,
                    iconColor: "text-blue-600",
                    fromColor: "from-blue-50",
                    toColor: "to-blue-100",
                    borderColor: "border-blue-200",
                    textColor: "text-blue-600",
                    value: data.stats.level?.toLocaleString() || 0,
                    label: "Level",
                    textLabelColor: "text-blue-700",
                  },
                  {
                    icon: Coins,
                    iconColor: "text-yellow-600",
                    fromColor: "from-yellow-50",
                    toColor: "to-yellow-100",
                    borderColor: "border-yellow-200",
                    textColor: "text-yellow-600",
                    value: data.stats.coins?.toLocaleString() || 0,
                    label: "Coins",
                    textLabelColor: "text-yellow-700",
                  },
                  {
                    icon: Crown,
                    iconColor: "text-green-600",
                    fromColor: "from-green-50",
                    toColor: "to-green-100",
                    borderColor: "border-green-200",
                    textColor: "text-green-600",
                    value: data.stats.modes.total.wins?.toLocaleString() || 0,
                    label: "Wins",
                    textLabelColor: "text-green-700",
                  },
                  {
                    icon: Zap,
                    iconColor: "text-red-600",
                    fromColor: "from-red-50",
                    toColor: "to-red-100",
                    borderColor: "border-red-200",
                    textColor: "text-red-600",
                    value: data.stats.modes.total.finalKills?.toLocaleString() || 0,
                    label: "Final Kills",
                    textLabelColor: "text-red-700",
                  },
                  {
                    icon: Swords,
                    iconColor: "text-indigo-600",
                    fromColor: "from-indigo-50",
                    toColor: "to-indigo-100",
                    borderColor: "border-indigo-200",
                    textColor: "text-indigo-600",
                    value: data.stats.modes.total.kills?.toLocaleString() || 0,
                    label: "Kills",
                    textLabelColor: "text-indigo-700",
                  },
                  {
                    icon: TrendingUp,
                    iconColor: "text-purple-600",
                    fromColor: "from-purple-50",
                    toColor: "to-purple-100",
                    borderColor: "border-purple-200",
                    textColor: "text-purple-600",
                    value: data.stats.modes.total.deaths > 0 ? (data.stats.modes.total.kills / data.stats.modes.total.deaths).toFixed(2) : data.stats.modes.total.kills.toFixed(2),
                    label: "K/D Ratio",
                    textLabelColor: "text-purple-700",
                  },
                  {
                    icon: Target,
                    iconColor: "text-orange-600",
                    fromColor: "from-orange-50",
                    toColor: "to-orange-100",
                    borderColor: "border-orange-200",
                    textColor: "text-orange-600",
                    value: data.stats.modes.total.finalDeaths > 0 ? (data.stats.modes.total.finalKills / data.stats.modes.total.finalDeaths).toFixed(2) : data.stats.modes.total.finalKills.toFixed(2),
                    label: "Final K/D Ratio",
                    textLabelColor: "text-orange-700",
                  },
                  {
                    icon: Bed,
                    iconColor: "text-teal-600",
                    fromColor: "from-teal-50",
                    toColor: "to-teal-100",
                    borderColor: "border-teal-200",
                    textColor: "text-teal-600",
                    value: data.stats.modes.total.bedsBroken?.toLocaleString() || 0,
                    label: "Beds Broken",
                    textLabelColor: "text-teal-700",
                  },
                  {
                    icon: Shield,
                    iconColor: "text-emerald-600",
                    fromColor: "from-emerald-50",
                    toColor: "to-emerald-100",
                    borderColor: "border-emerald-200",
                    textColor: "text-emerald-600",
                    value: data.stats.modes.total.bedsLost > 0 ? (data.stats.modes.total.bedsBroken / data.stats.modes.total.bedsLost).toFixed(2) : data.stats.modes.total.bedsBroken.toFixed(2),
                    label: "Beds Broken / Lost Ratio",
                    textLabelColor: "text-emerald-700",
                  },
                  {
                    icon: Trophy,
                    iconColor: "text-violet-600",
                    fromColor: "from-violet-50",
                    toColor: "to-violet-100",
                    borderColor: "border-violet-200",
                    textColor: "text-violet-600",
                    value: data.stats.modes.total.resourcesCollected?.toLocaleString() || 0,
                    label: "Resources",
                    textLabelColor: "text-violet-700",
                  },
                  {
                    icon: Gamepad2,
                    iconColor: "text-pink-600",
                    fromColor: "from-pink-50",
                    toColor: "to-pink-100",
                    borderColor: "border-pink-200",
                    textColor: "text-pink-600",
                    value: data.stats.modes.total.gamesPlayed?.toLocaleString() || 0,
                    label: "Games Played",
                    textLabelColor: "text-pink-700",
                  },
                  {
                    icon: Percent,
                    iconColor: "text-cyan-600",
                    fromColor: "from-cyan-50",
                    toColor: "to-cyan-100",
                    borderColor: "border-cyan-200",
                    textColor: "text-cyan-600",
                    value: `${data.stats.modes.total.gamesPlayed > 0 ? ((data.stats.modes.total.wins / data.stats.modes.total.gamesPlayed) * 100).toFixed(1) : "0.0"}%`,
                    label: "Win Rate",
                    textLabelColor: "text-cyan-700",
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className={`text-center p-3 xl:p-4 bg-gradient-to-br ${stat.fromColor} ${stat.toColor} rounded-lg border ${stat.borderColor} hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-default flex flex-col items-center justify-center`}
                  >
                    <stat.icon className={`w-6 h-6 ${stat.iconColor} mx-auto mb-2`} />
                    <div className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</div>
                    <div className={clsx(stat.textLabelColor, "font-medium", stat.label.length > 10 ? "text-sm" : "text-base")}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>{" "}
          {/* Main Modes Table - Transposed with Dynamic Stats */}
          <Card className="bg-white/75 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Main Mode Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className={clsx("w-full text-sm md:text-base", minecraft.className)}>
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2"></th>
                      {Object.entries(FRIENDLY_MODE_NAMES).map(([mode, friendlyName]) => (
                        <th key={mode} className="text-right py-3 px-2 min-w-[100px]">
                          {friendlyName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {FRIENDLY_STAT_NAMES.map((statGroup, groupIndex) =>
                      Object.entries(statGroup).map(([statKey, statName]) => {
                        const calculateStat = (
                          modeData:
                            | {
                                gamesPlayed?: number;
                                wins?: number;
                                losses?: number;
                                kills?: number;
                                deaths?: number;
                                finalKills?: number;
                                finalDeaths?: number;
                                bedsBroken?: number;
                                bedsLost?: number;
                                winstreak?: number;
                                itemsPurchased?: number;
                                ironCollected?: number;
                                goldCollected?: number;
                                diamondsCollected?: number;
                                emeraldsCollected?: number;
                                resourcesCollected?: number;
                                [key: string]: number | undefined;
                              }
                            | undefined,
                          key: string
                        ) => {
                          if (!modeData) return "0";

                          switch (key) {
                            case "wlr":
                              return (modeData.losses ?? 0) > 0 ? ((modeData.wins ?? 0) / (modeData.losses ?? 1)).toFixed(2) : (modeData.wins ?? 0).toFixed(2);
                            case "kdr":
                              return (modeData.deaths ?? 0) > 0 ? ((modeData.kills ?? 0) / (modeData.deaths ?? 1)).toFixed(2) : (modeData.kills ?? 0).toFixed(2);
                            case "fkdr":
                              return (modeData.finalDeaths ?? 0) > 0 ? ((modeData.finalKills ?? 0) / (modeData.finalDeaths ?? 1)).toFixed(2) : (modeData.finalKills ?? 0).toFixed(2);
                            case "bblr":
                              return (modeData.bedsLost ?? 0) > 0 ? ((modeData.bedsBroken ?? 0) / (modeData.bedsLost ?? 1)).toFixed(2) : (modeData.bedsBroken ?? 0).toFixed(2);
                            default:
                              return (modeData[key] ?? 0).toLocaleString();
                          }
                        };

                        return (
                          <tr key={`${groupIndex}-${statKey}`} className="border-b hover:bg-gray-50">
                            <td className="py-2 md:py-3 px-1 md:px-2 font-medium">{statName}</td>
                            {Object.entries(FRIENDLY_MODE_NAMES).map(([mode]) => {
                              const modeData = data.stats.modes[mode];
                              return (
                                <td key={mode} className="py-2 md:py-3 px-1 md:px-2 text-right font-mono">
                                  {calculateStat(modeData, statKey)}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          {/* Additional Modes Table */}
          <Card className="bg-white/75 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Additional Mode Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto max-w-full">
                <table className="w-full text-sm min-w-[800px]">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">Mode</th>
                      <th className="text-right py-3 px-2">Games Played</th>
                      <th className="text-right py-3 px-2">Wins</th>
                      <th className="text-right py-3 px-2">Losses</th>
                      <th className="text-right py-3 px-2">WLR</th>
                      <th className="text-right py-3 px-2">Final Kills</th>
                      <th className="text-right py-3 px-2">Final Deaths</th>
                      <th className="text-right py-3 px-2">FKDR</th>
                      <th className="text-right py-3 px-2">Beds Broken</th>
                      <th className="text-right py-3 px-2">Beds Lost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(FRIENDLY_EXTRA_MODE_NAMES).map(([mode, friendlyName]) => {
                      const modeData = data.stats.modes[mode];
                      if (!modeData || modeData?.gamesPlayed === 0) return null;
                      return (
                        <tr key={mode} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-2 font-medium">{friendlyName}</td>
                          <td className="py-3 px-2 text-right font-mono">{modeData.gamesPlayed?.toLocaleString() || 0}</td>
                          <td className="py-3 px-2 text-right font-mono">{modeData.wins?.toLocaleString() || 0}</td>
                          <td className="py-3 px-2 text-right font-mono">{modeData.losses?.toLocaleString() || 0}</td>
                          <td className="py-3 px-2 text-right font-mono">{modeData.losses > 0 ? (modeData.wins / modeData.losses).toFixed(2) : modeData.wins.toFixed(2)}</td>
                          <td className="py-3 px-2 text-right font-mono">{modeData.finalKills?.toLocaleString() || 0}</td>
                          <td className="py-3 px-2 text-right font-mono">{modeData.finalDeaths?.toLocaleString() || 0}</td>
                          <td className="py-3 px-2 text-right font-mono">{modeData.finalDeaths > 0 ? (modeData.finalKills / modeData.finalDeaths).toFixed(2) : modeData.finalKills.toFixed(2)}</td>
                          <td className="py-3 px-2 text-right font-mono">{modeData.bedsBroken?.toLocaleString() || 0}</td>
                          <td className="py-3 px-2 text-right font-mono">{modeData.bedsLost?.toLocaleString() || 0}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          {/* Summary */}
          {summary && (
            <Card className="bg-white/75 backdrop-blur-sm">
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
          )}
          {/* Challenges */}
          <Card className="bg-white/75 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(CHALLENGES).map((challenge: { n: number; name: string; rules: string[]; reward: string }) => {
                  const isCompleted = data.stats.challenges?.[challenge.n] || false;
                  const formatTitle = (challenge: { n: number; name: string; rules: string[]; reward: string }) => {
                    return `Challenge ${challenge.n + 1} - ${challenge.name}\n${challenge.rules.map((r, i) => `${i + 1}. ${r}`).join("\n")}\nReward: ${challenge.reward}`;
                  };
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
          <Card className="bg-white/75 backdrop-blur-sm">
            <CardContent className="text-center py-4">
              <p className="text-sm text-muted-foreground">Data updated at {timeFormatted} • Cached for performance</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Route segment config for partial prerendering
export const experimental_ppr = true;

// Enable static generation with ISR (production only)
export const revalidate = 300;

// Main page component with proper async handling
export default async function UserPage({ params }: UserPageProps) {
  const { username } = await params;

  return (
    <BackgroundWrapper>
      <Suspense fallback={<UserSkeleton />}>
        <UserContent username={username} />
      </Suspense>
    </BackgroundWrapper>
  );
}
