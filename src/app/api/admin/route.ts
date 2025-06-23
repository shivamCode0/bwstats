import { NextRequest, NextResponse } from "next/server";
import AccessMonitor from "@/lib/accessMonitor";

// Simple authentication - you should replace this with proper auth
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "change-this-token";

function isAuthenticated(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${ADMIN_TOKEN}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const ip = searchParams.get("ip");
  const date = searchParams.get("date");
  const days = parseInt(searchParams.get("days") || "7");

  try {
    switch (action) {
      case "analytics":
        const analytics = await AccessMonitor.getAnalytics(days);
        return NextResponse.json(analytics);

      case "top-ips":
        const topIPs = await AccessMonitor.getTopIPsByDate(date || undefined);
        return NextResponse.json(topIPs);

      case "check-ip":
        if (!ip) {
          return NextResponse.json({ error: "IP parameter required" }, { status: 400 });
        }
        const dailyCount = await AccessMonitor.getDailyAccessCount(ip, date || undefined);
        const suspicious = await AccessMonitor.isSuspiciousIP(ip);
        const blocked = await AccessMonitor.isIPBlocked(ip);
        return NextResponse.json({
          ip,
          dailyCount,
          suspicious,
          blocked,
        });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Admin API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { action, ip, duration } = body;

  if (!ip) {
    return NextResponse.json({ error: "IP parameter required" }, { status: 400 });
  }

  try {
    switch (action) {
      case "block":
        const durationSeconds = duration || 3600; // Default 1 hour
        const blocked = await AccessMonitor.blockIP(ip, durationSeconds);
        return NextResponse.json({ success: blocked, ip, duration: durationSeconds });

      case "unblock":
        const unblocked = await AccessMonitor.unblockIP(ip);
        return NextResponse.json({ success: unblocked, ip });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Admin API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
