import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Users, TrendingUp, Trophy, Crown, Star, Target, ExternalLink, Sparkles, Medal, Zap } from "lucide-react";
import Link from "@/components/Link";
import ClientHomePage from "./ClientHomePage";
import LeaderboardPreviewSection from "@/components/LeaderboardPreviewSection";

export const revalidate = 3600;

export default function Home() {
  // Example usernames for testing
  const exampleUsernames = ["Technoblade", "gamerboy80", "WarOG", "shivamCode"];

  return (
    <div className="mb-16">
      {/* Hero Section */}
      <ClientHomePage exampleUsernames={exampleUsernames} />

      {/* Main content section with client-side leaderboard previews */}
      <div className="relative -mt-16 z-10">
        <div className="container mx-auto px-4">
          {/* Live Leaderboard Previews - Now Client Side */}
          <LeaderboardPreviewSection />

          {/* Enhanced Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-900 rounded-full mb-4 shadow-lg">
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
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-600 rounded-full mb-4 shadow-lg">
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
          <Card className="bg-neutral-900 border-0 shadow-2xl text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-neutral-900/95"></div>
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
