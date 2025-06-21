"use client";

import { useState } from "react";
import { FRIENDLY_LB_NAMES, LB_ORDER } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Crown, Star, TrendingUp, Gamepad2, Swords, Target, Bed, Zap, Users, Medal, Award, ChevronRight, BarChart3 } from "lucide-react";
import Link from "next/link";
import { minecraft } from "@/app/fonts/fonts";
import clsx from "clsx";

export default function LeaderboardsPage() {
  const [backgroundImageIndex] = useState(() => Math.floor(Math.random() * 14) + 1);

  const getLeaderboardInfo = (lbKey: string) => {
    const info = {
      bedwars_level: {
        icon: Star,
        color: "blue",
        gradient: "from-blue-500 to-indigo-600",
        bgGradient: "from-blue-50 to-indigo-100",
        borderColor: "border-blue-200",
        description: "Compete for the highest Bedwars level",
        metric: "Experience Points",
        estimated: "50,000+",
      },
      wins_new: {
        icon: Crown,
        color: "green",
        gradient: "from-green-500 to-emerald-600",
        bgGradient: "from-green-50 to-emerald-100",
        borderColor: "border-green-200",
        description: "Battle for the most victories",
        metric: "Total Wins",
        estimated: "25,000+",
      },
      wins_1: {
        icon: Crown,
        color: "emerald",
        gradient: "from-emerald-500 to-green-600",
        bgGradient: "from-emerald-50 to-green-100",
        borderColor: "border-emerald-200",
        description: "Weekly wins leaderboard",
        metric: "Weekly Wins",
        estimated: "15,000+",
      },
      final_kills_new: {
        icon: TrendingUp,
        color: "red",
        gradient: "from-red-500 to-pink-600",
        bgGradient: "from-red-50 to-pink-100",
        borderColor: "border-red-200",
        description: "Dominate with final eliminations",
        metric: "Final Kills",
        estimated: "100,000+",
      },
      final_kills_1: {
        icon: TrendingUp,
        color: "rose",
        gradient: "from-rose-500 to-pink-600",
        bgGradient: "from-rose-50 to-pink-100",
        borderColor: "border-rose-200",
        description: "Weekly final kills leaderboard",
        metric: "Weekly Final Kills",
        estimated: "50,000+",
      },
    };
    return info[lbKey as keyof typeof info] || info.level;
  };

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
        <div className="mx-auto py-8 px-4" style={{ maxWidth: "1400px" }}>
          <div className="space-y-8">
            {/* Hero Header Section */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
              <CardHeader className="text-center py-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-t-lg">
                <div className="flex items-center justify-center gap-6 mb-6">
                  <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg">
                    <Trophy className="w-12 h-12 text-white" />
                  </div>
                  <CardTitle className={clsx("text-7xl font-bold tracking-wide bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", minecraft.className)}>
                    Bedwars Leaderboards
                  </CardTitle>
                  <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg">
                    <Trophy className="w-12 h-12 text-white" />
                  </div>
                </div>
                <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
                  Compete with the <span className="font-semibold text-blue-600">best players</span> across the world and climb the ranks in various Bedwars statistics
                </p>
                <div className="flex items-center justify-center gap-6 mt-6">
                  <Badge className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                    <Users className="w-4 h-4 mr-2" />
                    Live Rankings
                  </Badge>
                  <Badge className="px-4 py-2 text-sm bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Real-time Stats
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Leaderboard Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {LB_ORDER.map((lbKey, index) => {
                const info = getLeaderboardInfo(lbKey);
                const IconComponent = info.icon;

                return (
                  <Link href={`/leaderboards/${lbKey}`} className="no-underline group" key={lbKey}>
                    <Card className="h-full cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-white/80 backdrop-blur-sm border-2 hover:border-gray-300 group-hover:bg-white/90 overflow-hidden">
                      {/* Card Header with Gradient Background */}
                      <div className={`bg-gradient-to-br ${info.bgGradient} border-b ${info.borderColor} p-6 relative overflow-hidden`}>
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-0 left-0 w-20 h-20 bg-white rounded-full -translate-x-10 -translate-y-10"></div>
                          <div className="absolute bottom-0 right-0 w-16 h-16 bg-white rounded-full translate-x-8 translate-y-8"></div>
                        </div>

                        {/* Icon and Rank Badge */}
                        <div className="relative flex items-center justify-between mb-4">
                          <div className={`p-4 bg-gradient-to-br ${info.gradient} rounded-xl shadow-lg group-hover:shadow-xl transition-shadow`}>
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                          <Badge className={`text-xs px-3 py-1 bg-white/80 text-${info.color}-700 border-${info.color}-200`}>#{index + 1}</Badge>
                        </div>

                        {/* Title */}
                        <h3 className={`font-bold text-xl text-${info.color}-800 mb-2 group-hover:text-${info.color}-900 transition-colors`}>
                          {FRIENDLY_LB_NAMES[lbKey as keyof typeof FRIENDLY_LB_NAMES]}
                        </h3>

                        {/* Description */}
                        <p className={`text-sm text-${info.color}-600 leading-relaxed`}>{info.description}</p>
                      </div>

                      {/* Card Body */}
                      <CardContent className="p-6 space-y-4">
                        {/* Metric Info */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Metric:</span>
                            <span className="text-sm font-semibold text-gray-800">{info.metric}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Top Players:</span>
                            <span className="text-sm font-semibold text-gray-800">{info.estimated}</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${info.gradient} rounded-full transition-all duration-1000 group-hover:w-full`} style={{ width: `${60 + index * 5}%` }}></div>
                        </div>

                        {/* Action Button */}
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs text-gray-500">View Rankings</span>
                          <ChevronRight className={`w-5 h-5 text-${info.color}-500 group-hover:translate-x-1 transition-transform`} />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {/* Stats Overview */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-800">
                  <Award className="w-6 h-6 inline mr-2 text-yellow-500" />
                  Leaderboard Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">8</div>
                    <div className="text-sm text-gray-600">Categories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">50K+</div>
                    <div className="text-sm text-gray-600">Players Tracked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">24/7</div>
                    <div className="text-sm text-gray-600">Live Updates</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-1">100%</div>
                    <div className="text-sm text-gray-600">Accurate Data</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="text-center py-6">
                <p className="text-gray-600 mb-2">
                  <strong>🏆 Rankings updated every hour</strong> • Data sourced directly from Hypixel API
                </p>
                <p className="text-sm text-gray-500">Compete fairly and climb the leaderboards with your skill and dedication</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
