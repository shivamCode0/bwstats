import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Crown, Star, Target, ExternalLink, Medal } from "lucide-react";
import Link from "next/link";

export default async function LeaderboardPreviewSection() {
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
          <CardDescription className="text-blue-100 text-lg">See the top 100 players in each category.</CardDescription>
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

            <Link href="/leaderboards/bedwars_level" className="block">
              <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
                View BW Level Leaderboard
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

            <Link href="/leaderboards/wins_new" className="block">
              <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                View Wins Leaderboard
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

            <Link href="/leaderboards/final_kills_new" className="block">
              <Button className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white">
                View Final Kills Leaderboard <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
