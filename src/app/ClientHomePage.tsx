"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Clock, Gamepad2 } from "lucide-react";
import { minecraft } from "@/app/fonts/fonts";
import clsx from "clsx";

interface ClientHomePageProps {
  exampleUsernames: string[];
}

export default function ClientHomePage({ exampleUsernames }: ClientHomePageProps) {
  const [username, setUsername] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Load recent searches from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("bwstats_recent_searches");
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse recent searches:", e);
        }
      }
    }
  }, []);

  const saveToRecentSearches = (username: string) => {
    if (typeof window !== "undefined") {
      const updated = [username, ...recentSearches.filter((u) => u !== username)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("bwstats_recent_searches", JSON.stringify(updated));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    if (trimmedUsername) {
      saveToRecentSearches(trimmedUsername);
      window.location.href = `/user/${encodeURIComponent(trimmedUsername)}`;
    } else {
      alert("Enter your username to see your stats.");
    }
  };

  const handleQuickSearch = (username: string) => {
    saveToRecentSearches(username);
    window.location.href = `/user/${encodeURIComponent(username)}`;
  };

  return (
    <div className="hero-image min-h-[75vh] flex items-center">
      <div className="w-full h-full backdrop-blur-[5px]">
        <div className="w-full h-1/2 flex items-center">
          <div className="hero-text w-full md:w-90/100 xl:w-60/100 px-4">
            <div className="text-center mb-8">
              <h1 className={clsx("text-6xl md:text-7xl font-bold mb-4 text-white", minecraft.className)}>Bedwars Stats</h1>
              <p className="text-xl md:text-2xl text-white/90 mb-2">Search any player, view leaderboards, and track your progress</p>
            </div>

            <form onSubmit={handleSubmit} className="mb-8">
              <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
                <Input
                  name="user"
                  type="text"
                  placeholder="Enter Minecraft Username"
                  id="input-mcusername"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
                  className="flex-1 text-lg py-6 bg-white/10 border-white/20 text-white placeholder:text-white/70 backdrop-blur-sm focus:bg-white/20 transition-all"
                />
                <Button type="submit" className="text-lg py-6 px-8 bg-neutral-900 hover:bg-neutral-800 border-0 shadow-lg">
                  <Search className="w-5 h-5 mr-2" />
                  View Stats
                </Button>
              </div>
            </form>

            {/* Quick action buttons */}

            {/* Recent searches */}
            {recentSearches.length > 0 ? (
              <div className="max-w-2xl mx-auto text-center">
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Recent Searches
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search) => (
                        <Button key={search} variant="secondary" size="sm" onClick={() => handleQuickSearch(search)} className="bg-white/20 hover:bg-white/30 text-white border-0">
                          {search}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {exampleUsernames.map((name) => (
                  <Button key={name} variant="outline" onClick={() => handleQuickSearch(name)} className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                    <Search className="w-4 h-4 mr-2" />
                    {name}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
