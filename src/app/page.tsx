"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Code, Users, TrendingUp } from "lucide-react";

export default function Home() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      router.push(`/user/${encodeURIComponent(username.trim())}`);
    } else {
      alert("Enter your username to see your stats.");
    }
  };

  return (
    <>
      {/* Preserve original hero image styling */}
      <div className="hero-image">
        <div className="hero-text">
          <h1 className="text-5xl font-bold mb-4">Bedwars Stats</h1>
          <label htmlFor="input-mcusername" className="block text-xl mb-6">
            Enter your username to see your stats.
          </label>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                name="user"
                type="text"
                placeholder="Minecraft Username"
                id="input-mcusername"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
                className="flex-1 text-lg py-6 bg-white/10 border-white/20 text-white placeholder:text-white/70 backdrop-blur-sm"
              />
              <Button type="submit" className="text-lg py-6 px-8 bg-blue-600 hover:bg-blue-700">
                View Stats
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Content section using container like Bootstrap */}
      <div className="container mx-auto px-4 mt-8">
        <h2 className="text-center text-3xl font-bold mb-6">Hypixel Bedwars Stats</h2>
        <div className="prose max-w-none">
          <p className="text-lg text-center mb-8">
            This easy-to-use Hypixel bedwars stat checker is one of the most detailed stats trackers. Get all the information you need in one place. You can easily show how good you are sharing your
            stats link with your friends.
          </p>
          <p className="text-center mb-8">
            We created this website to give the basic player data, as well as more advanced information about different modes and stats. We are always improving this website to be more detailed to
            make it the best.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="text-center">
            <CardHeader>
              <Search className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <CardTitle>Easy Search</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Quickly find any player's Bedwars statistics with our simple search functionality.</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <CardTitle>Detailed Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Get comprehensive statistics including wins, kills, final kills, and much more.</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <CardTitle>Share with Friends</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Share your stats easily with friends and compare your performance.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
