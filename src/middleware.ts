import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { AccessMonitor } from "@/lib/accessMonitor";

// Initialize Redis client for rate limiting
const redis = Redis.fromEnv();

// Create a rate limiter - 15 requests per 60 seconds per IP (more reasonable for legitimate users)
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(15, "60 s"),
  analytics: true,
});

// Helper function to get client IP
function getClientIP(request: NextRequest): string {
  // Try various headers to get the real client IP
  // With Cloudflare, CF-Connecting-IP is most reliable
  const cfIP = request.headers.get("cf-connecting-ip");
  const realIP = request.headers.get("x-real-ip");
  const forwarded = request.headers.get("x-forwarded-for");

  // Use nullish coalescing operator to return the first non-null/undefined value
  // Priority: CF-Connecting-IP > X-Real-IP > X-Forwarded-For (first IP) > unknown
  return cfIP ?? realIP ?? forwarded?.split(",")[0].trim() ?? "unknown";
}

// Helper function to log access attempts
async function logAccess(ip: string, path: string, userAgent: string, success: boolean) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    ip,
    path,
    userAgent,
    success,
  };

  console.log(`[ACCESS] ${success ? "✅" : "❌"} ${timestamp} | IP: ${ip} | Path: ${path} | UA: ${userAgent}`);

  // Store in Redis for analytics (optional - keeps last 1000 entries)
  try {
    const logKey = `access_logs:${Date.now()}:${Math.random()}`;
    await redis.setex(logKey, 86400, JSON.stringify(logEntry)); // Keep for 24 hours

    // Also increment counters for monitoring
    const dailyKey = `daily_access:${new Date().toISOString().split("T")[0]}:${ip}`;
    await redis.incr(dailyKey);
    await redis.expire(dailyKey, 86400 * 7); // Keep daily stats for 7 days
  } catch (error) {
    console.error("Failed to log access to Redis:", error);
  }
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
    /telegrambot/i,
  ];

  return crawlerPatterns.some((pattern) => pattern.test(userAgent));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply to user pages
  if (!pathname.startsWith("/user/")) {
    return NextResponse.next();
  }
  const ip = getClientIP(request);
  const userAgent = request.headers.get("user-agent") || "unknown";
  // Skip rate limiting for known search engine crawlers
  const isCrawler = isSearchEngineCrawler(userAgent);
  
  // For crawlers, just log and continue (no Redis calls)
  if (isCrawler) {
    console.log(`[CRAWLER] ${ip} | ${pathname} | ${userAgent}`);
    return NextResponse.next();
  }
  
  // Check if IP is blocked first (only for non-crawlers)
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
      }    );
  }
  
  try {
    // Check rate limit
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);

    // Log the access attempt
    await logAccess(ip, pathname, userAgent, success);

    if (!success) {
      console.warn(`[RATE_LIMITED] IP ${ip} exceeded rate limit for ${pathname}`);

      // Return rate limit error
      return new NextResponse(
        JSON.stringify({
          error: "Too many requests",
          message: "You have exceeded the rate limit. Please try again later.",
          limit,
          remaining: 0,
          reset: new Date(reset),
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": reset.toString(),
            "Retry-After": Math.round((reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // Add rate limit headers to successful responses
    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", limit.toString());
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    response.headers.set("X-RateLimit-Reset", reset.toString());

    return response;
  } catch (error) {
    console.error("Middleware error:", error);

    // Log the access attempt even if rate limiting fails
    await logAccess(ip, pathname, userAgent, true);

    // Continue with request if rate limiting fails
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/user/:path*"],
};
