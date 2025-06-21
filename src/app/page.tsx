import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Users, TrendingUp, Trophy, Crown, Star, Target, ExternalLink, Sparkles, Medal, Zap } from "lucide-react";
import Link from "next/link";
import { minecraft } from "@/app/fonts/fonts";
import clsx from "clsx";
import { getLeaderboardsCached } from "@/lib/getLeaderboards";
import ClientHomePage from "./ClientHomePage";

// ISR: Regenerate every 30 minutes
export const revalidate = 1800;

interface TopPlayer {
  uuid: string;
  username: string;
  level?: number;
  levelFormatted?: string;
  totalWins?: number;
  totalFinals?: number;
  totalFinalsFormatted?: string;
}

interface LeaderboardPreview {
  level: TopPlayer[];
  wins: TopPlayer[];
  finalKills: TopPlayer[];
}

export default async function Home() {
  // Example usernames for testing
  const exampleUsernames = ["Technoblade", "Dream", "Grian", "TommyInnit", "Wilbur"];

  // Fetch leaderboard data with ISR
  let leaderboardPreview: LeaderboardPreview = {
    level: [],
    wins: [],
    finalKills: [],
  };

  try {
    const leaderboardData = await getLeaderboardsCached();
    leaderboardPreview = {
      level: (leaderboardData.stats.bedwars_level || []).slice(0, 5) as TopPlayer[],
      wins: (leaderboardData.stats.wins_new || []).slice(0, 5) as TopPlayer[],
      finalKills: (leaderboardData.stats.final_kills_new || []).slice(0, 5) as TopPlayer[],
    };
  } catch (error) {
    console.error("Failed to fetch leaderboard data:", error);
  }

  return (
    <div className="mb-16">
      {/* Hero Section */}
      <ClientHomePage exampleUsernames={exampleUsernames} />

      {/* Main content section with ISR leaderboard previews */}
      <div className="relative -mt-16 z-10">
        <div className="container mx-auto px-4">
          {/* Live Leaderboard Previews */}
          <Card className="mb-12 bg-white/95 backdrop-blur-sm border-0 shadow-2xl overflow-hidden">
            <CardHeader className="text-center bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 via-blue-600/90 to-indigo-600/90 backdrop-blur"></div>
              <div className="relative z-10">
                <CardTitle className="text-4xl font-bold mb-3 flex items-center justify-center gap-3">
                  <Trophy className="w-10 h-10" />
                  Live Leaderboard Previews
                  <Trophy className="w-10 h-10" />
                </CardTitle>
                <CardDescription className="text-blue-100 text-lg">See the top 5 players in each category - updated every 30 minutes</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Level Leaders */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">Highest Level</h3>
                      <p className="text-gray-600">Experience masters</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {leaderboardPreview.level.map((player, index) => (
                      <div key={player.uuid} className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 hover:shadow-md transition-all">
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 text-white font-bold rounded-full text-sm">{index + 1}</div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{player.username}</p>
                          <p className="text-sm text-gray-600">Level {player.level?.toLocaleString()}</p>
                        </div>
                        <Medal className="w-5 h-5 text-yellow-600" />
                      </div>
                    ))}
                  </div>
                  <Link href="/leaderboards/bedwars_level" className="block">
                    <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
                      View Full Level Leaderboard
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>

                {/* Win Leaders */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">Most Wins</h3>
                      <p className="text-gray-600">Victory champions</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {leaderboardPreview.wins.map((player, index) => (
                      <div key={player.uuid} className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:shadow-md transition-all">
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 text-white font-bold rounded-full text-sm">{index + 1}</div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{player.username}</p>
                          <p className="text-sm text-gray-600">{player.totalWins?.toLocaleString()} wins</p>
                        </div>
                        <Crown className="w-5 h-5 text-green-600" />
                      </div>
                    ))}
                  </div>
                  <Link href="/leaderboards/wins_new" className="block">
                    <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                      View Full Wins Leaderboard
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>

                {/* Final Kill Leaders */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl shadow-lg">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">Most Final Kills</h3>
                      <p className="text-gray-600">Elimination experts</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {leaderboardPreview.finalKills.map((player, index) => (
                      <div key={player.uuid} className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200 hover:shadow-md transition-all">
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 text-white font-bold rounded-full text-sm">{index + 1}</div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{player.username}</p>
                          <p className="text-sm text-gray-600">{player.totalFinalsFormatted} final kills</p>
                        </div>
                        <Target className="w-5 h-5 text-red-600" />
                      </div>
                    ))}
                  </div>
                  <Link href="/leaderboards/final_kills_new" className="block">
                    <Button className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white">
                      View Full FK Leaderboard
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Lightning Fast Search</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">Instantly find any player&apos;s Bedwars statistics with our optimized search system. Results load in seconds!</p>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  ⚡ Instant Results
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4 shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Comprehensive Analytics</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">Get detailed statistics including wins, kills, final kills, ratios, and performance across all game modes.</p>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  📊 50+ Metrics
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-4 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Live Rankings</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">Compare yourself with the best players worldwide. Track your ranking and see who&apos;s at the top!</p>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  🏆 Real-time Updates
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Call to action */}
          <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 border-0 shadow-2xl text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-purple-600/90 to-indigo-600/90"></div>
            <CardContent className="relative z-10 text-center py-12">
              <Sparkles className="w-16 h-16 mx-auto mb-6 text-white" />
              <h3 className="text-3xl font-bold mb-4">Ready to Dominate Bedwars?</h3>
              <p className="text-xl text-blue-100 mb-8">Join thousands of players tracking their performance and climbing the leaderboards</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/leaderboards">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold shadow-lg">
                    <Trophy className="w-5 h-5 mr-2" />
                    Explore All Leaderboards
                  </Button>
                </Link>
                <Link href="/#input-mcusername">
                  <Button size="lg" variant="default" className="border-white text-white hover:bg-white hover:text-blue-600">
                    <Search className="w-5 h-5 mr-2" />
                    Search Your Stats
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
