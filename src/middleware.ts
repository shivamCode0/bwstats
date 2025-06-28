import { NextRequest, NextResponse } from "next/server";

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
    /telegrambot/i,
  ];

  return crawlerPatterns.some((pattern) => pattern.test(userAgent));
}

// Lightweight logging function
async function logAccess(ip: string, path: string, userAgent: string, success: boolean) {
  const timestamp = new Date().toISOString();

  console.log(`[ACCESS] ${success ? "✅" : "❌"} ${ip} | ${userAgent} | ${path}`);
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
    console.log(`[CRAWLER] ${ip} | ${userAgent} | ${pathname}`);
    return NextResponse.next();
  }

  // Log access attempt
  await logAccess(ip, pathname, userAgent, true);
  return NextResponse.next();
}
