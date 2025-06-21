# Redis Caching Setup with Upstash

This project now uses Redis (via Upstash) for high-performance caching instead of MongoDB. This provides significant performance improvements and better user experience.

## Benefits of Redis Caching

- **10-100x faster** than MongoDB for cache operations
- **Automatic TTL** - no manual cleanup required
- **Built-in expiration** - user stats (5 min), leaderboards (4 hours)
- **Fallback safety** - still works if Redis is unavailable
- **Cost effective** - Redis instances are cheaper for caching

## Setup Instructions

### 1. Create an Upstash Redis Database

1. Go to [https://upstash.com/](https://upstash.com/)
2. Sign up/login with your GitHub account
3. Click "Create Database"
4. Choose a name (e.g., `bwstats-cache`)
5. Select a region close to your deployment
6. Click "Create"

### 2. Get Your Redis Credentials

After creating the database:

1. Go to your database dashboard
2. Copy the "REST URL" and "REST TOKEN"
3. Add them to your `.env` file:

```bash
UPSTASH_REDIS_REST_URL=https://your-db-name.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

### 3. Deploy to Production

#### Vercel

1. Add the environment variables in your Vercel dashboard
2. Redeploy your application

#### Railway/Other Platforms

1. Add the environment variables to your deployment settings
2. Redeploy

## Cache Behavior

### User Stats Caching

- **Cache Key**: `user:{uuid}`
- **TTL**: 5 minutes (300 seconds)
- **Behavior**: First request fetches from Hypixel API, subsequent requests within 5 minutes serve from Redis

### Leaderboards Caching

- **Cache Key**: `leaderboards`
- **TTL**: 4 hours (14400 seconds)
- **Behavior**: First request fetches from Hypixel API, subsequent requests within 4 hours serve from Redis

### Fallback Strategy

- If Redis is unavailable, the application falls back to direct Hypixel API calls
- MongoDB is optionally kept for analytics/backup purposes
- No service interruption even if Redis goes down

## Performance Monitoring

The application logs cache hits/misses:

- `Cache HIT for {username} (Redis)` - Data served from cache
- `Cache MISS for {username} - fetching fresh data` - Fresh data fetched

## Cost Optimization

Upstash Free Tier includes:

- 10,000 requests per day
- 256 MB storage
- Perfect for small to medium traffic

For higher traffic, Upstash Pay-as-you-go starts at $0.20 per 100K requests.

## Development Mode

In development mode (`NODE_ENV=development`):

- Redis caching still works if configured
- MongoDB fallback is disabled for faster development
- You can develop without Redis by not setting the environment variables

## Troubleshooting

### Redis Connection Issues

Check your environment variables:

```bash
echo $UPSTASH_REDIS_REST_URL
echo $UPSTASH_REDIS_REST_TOKEN
```

### Performance Issues

Monitor your Redis usage in the Upstash dashboard to ensure you're not hitting rate limits.

### Cache Invalidation

To manually clear cache (useful for testing):

- User stats: Clear key `user:{uuid}`
- Leaderboards: Clear key `leaderboards`

You can do this via the Upstash CLI or dashboard.
