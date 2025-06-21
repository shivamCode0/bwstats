"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("User page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card className="max-w-md border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800">Something went wrong!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-red-700">{error.message.includes("Player not found") ? "Player not found or has no Bedwars data" : "Failed to load player stats. Please try again."}</p>
          <Button onClick={reset} variant="outline" className="w-full">
            Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
