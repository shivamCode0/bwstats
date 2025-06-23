import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { AccessMonitor } from "@/lib/accessMonitor";

// Initialize Redis client for logging
const redis = Redis.fromEnv();

// Helper function to get client IP (optimized for Cloudflare)
function getClientIP(request: NextRequest): string {
  // With Cloudflare, CF-Connecting-IP is most reliable
  const cfIP = request.headers.get("cf-connecting-ip");
  const realIP = request.headers.get("x-real-ip");
  const forwarded = request.headers.get("x-forwarded-for");

  return cfIP ?? realIP ?? forwarded?.split(",")[0].trim() ?? "unknown";
}

// Helper function to check if request is from a known search engine crawler
function isSearchEngineCrawler(userAgent: string): boolean {
  const crawlerPatterns = [
    /googlebot/i,
    /bingbot/i,
    /slurp/i, // Yahoo
    /duckduckbot/i,
    /baiduspider/i,
    /yandexbot/i,
    /facebookexternalhit/i,
    /twitterbot/i,
    /linkedinbot/i,
    /whatsapp/i,
    /telegrambot/i
  ];
  
  return crawlerPatterns.some(pattern => pattern.test(userAgent));
}

// Lightweight logging function
async function logAccess(ip: string, path: string, userAgent: string, success: boolean) {
  const timestamp = new Date().toISOString();
  
  console.log(`[ACCESS] ${success ? "✅" : "❌"} ${timestamp} | IP: ${ip} | Path: ${path} | UA: ${userAgent}`);

  // Minimal Redis logging - just daily counters
  try {
    const dailyKey = `daily_access:${new Date().toISOString().split("T")[0]}:${ip}`;
    await redis.incr(dailyKey);
    await redis.expire(dailyKey, 86400 * 7); // Keep daily stats for 7 days
  } catch (error) {
    console.error("Failed to log access to Redis:", error);
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply to user pages
  if (!pathname.startsWith("/user/")) {
    return NextResponse.next();
  }

  const ip = getClientIP(request);
  const userAgent = request.headers.get("user-agent") || "unknown";
  
  // Skip processing for known search engine crawlers
  const isCrawler = isSearchEngineCrawler(userAgent);
  
  if (isCrawler) {
    console.log(`[CRAWLER] ${ip} | ${pathname} | ${userAgent}`);
    return NextResponse.next();
  }
  
  // Check if IP is manually blocked (for admin interventions)
  try {
    const blocked = await AccessMonitor.isIPBlocked(ip);
    if (blocked) {
      console.warn(`[BLOCKED_IP] Blocked IP ${ip} attempted to access ${pathname}`);
      await logAccess(ip, pathname, userAgent, false);

      return new NextResponse(
        JSON.stringify({
          error: "Access denied",
          message: "Your IP address has been temporarily blocked due to suspicious activity.",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Log successful access
    await logAccess(ip, pathname, userAgent, true);
    return NextResponse.next();
    
  } catch (error) {
    console.error("Middleware error:", error);
    // Continue with request if monitoring fails
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/user/:path*"],
};
