import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Trophy, Star, Crown, Coins, Target, Bed, Zap, Swords, TrendingUp, Shield, Gamepad2, Percent } from "lucide-react";
import { minecraft } from "@/app/fonts/fonts";
import clsx from "clsx";

export function UserPageSkeleton() {
  return (
    <div className="mx-auto py-8 px-4" style={{ maxWidth: "1300px" }}>
      <div className="main-content gap-3 lg:gap-4 xl:gap-5">
        {/* Left sidebar skeleton */}
        <div className="leftbar space-y-3 hidden md:block md:w-[220px] lg:w-[250px] xl:w-[300px]">
          <Card className="bg-white/75 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="h-[430px] w-[200px] mx-auto bg-gray-200 animate-pulse rounded" />
              <CardTitle className="flex items-center justify-center gap-2">
                <User className="w-5 h-5" />
                <div className="h-6 w-32 bg-gray-200 animate-pulse rounded" />
              </CardTitle>
              <div className="space-y-2 mt-2">
                <div className="h-6 w-20 bg-gray-200 animate-pulse rounded mx-auto" />
                <div className="h-4 w-40 bg-gray-200 animate-pulse rounded mx-auto" />
              </div>
            </CardHeader>
          </Card>

          {/* Quick Stats skeleton */}
          <Card className="bg-white/75 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="flex justify-between items-center py-1 px-2 rounded">
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 animate-pulse rounded" />
                    <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" />
                  </span>
                  <div className="h-4 w-16 bg-gray-200 animate-pulse rounded" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main content skeleton */}
        <div className="flex-1 space-y-3">
          {/* Header skeleton */}
          <Card className="bg-white/75 backdrop-blur-sm mb-3">
            <CardHeader className="text-center py-6">
              <div className="flex items-center justify-center gap-3 lg:gap-4 xl:gap-5 mb-2">
                <div className="w-16 h-16 bg-gray-200 animate-pulse rounded-sm" />
                <div className="h-12 w-64 bg-gray-200 animate-pulse rounded" />
              </div>
              <div className="h-4 w-80 bg-gray-200 animate-pulse rounded mx-auto" />
            </CardHeader>
          </Card>

          {/* Comprehensive stats skeleton */}
          <Card className="bg-white/75 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Comprehensive Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 lg:gap-4 xl:gap-4">
                {[...Array(12)].map((_, index) => (
                  <div key={index} className="text-center p-3 xl:p-4 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center">
                    <div className="w-6 h-6 bg-gray-200 animate-pulse rounded mx-auto mb-2" />
                    <div className="h-8 w-12 bg-gray-200 animate-pulse rounded mb-1" />
                    <div className="h-4 w-16 bg-gray-200 animate-pulse rounded" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tables skeleton */}
          <Card className="bg-white/75 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Main Mode Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="space-y-2">
                  {[...Array(10)].map((_, index) => (
                    <div key={index} className="h-8 bg-gray-100 animate-pulse rounded" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/75 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Additional Mode Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="h-8 bg-gray-100 animate-pulse rounded" />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Challenges skeleton */}
          <Card className="bg-white/75 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(9)].map((_, index) => (
                  <div key={index} className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-4 bg-gray-200 animate-pulse rounded" />
                      <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
                    </div>
                    <div className="h-3 w-24 bg-gray-200 animate-pulse rounded" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
