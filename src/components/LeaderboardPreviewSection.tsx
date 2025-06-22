import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Crown, Star, Target, ExternalLink, Medal } from "lucide-react";
import Link from "next/link";
import { getLeaderboardsCached } from "@/lib/getLeaderboards";

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

async function getLeaderboardPreview(): Promise<LeaderboardPreview> {
  "use server";
  try {
    const res = await fetch("https://bwstats.shivam.pro/api/leaderboards/preview");
    if (!res.ok) throw new Error("Failed to fetch leaderboard preview");

    const leaderboardData = await res.json();

    return leaderboardData;
  } catch (error) {
    console.error("Failed to fetch leaderboard preview:", error);
    // Return empty data on error instead of failing
    return {
      level: [],
      wins: [],
      finalKills: [],
    };
  }
}

export default async function LeaderboardPreviewSection() {
  const leaderboardPreview = await getLeaderboardPreview();

  return (
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
              {leaderboardPreview.level.length > 0 ? (
                leaderboardPreview.level.map((player, index) => (
                  <div key={player.uuid} className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 hover:shadow-md transition-all">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 text-white font-bold rounded-full text-sm">{index + 1}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{player.username}</p>
                      <p className="text-sm text-gray-600">Level {player.level?.toLocaleString()}</p>
                    </div>
                    <Medal className="w-5 h-5 text-yellow-600" />
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">No data available</div>
              )}
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
              {leaderboardPreview.wins.length > 0 ? (
                leaderboardPreview.wins.map((player, index) => (
                  <div key={player.uuid} className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:shadow-md transition-all">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 text-white font-bold rounded-full text-sm">{index + 1}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{player.username}</p>
                      <p className="text-sm text-gray-600">{player.totalWins?.toLocaleString()} wins</p>
                    </div>
                    <Crown className="w-5 h-5 text-green-600" />
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">No data available</div>
              )}
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
              {leaderboardPreview.finalKills.length > 0 ? (
                leaderboardPreview.finalKills.map((player, index) => (
                  <div key={player.uuid} className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200 hover:shadow-md transition-all">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 text-white font-bold rounded-full text-sm">{index + 1}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{player.username}</p>
                      <p className="text-sm text-gray-600">{player.totalFinalsFormatted} final kills</p>
                    </div>
                    <Target className="w-5 h-5 text-red-600" />
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">No data available</div>
              )}
            </div>
            <Link href="/leaderboards/final_kills_new" className="block">
              <Button className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white">
                View Full FK Leaderboard <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
