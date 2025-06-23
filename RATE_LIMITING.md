# Rate Limiting and Access Monitoring

This implementation provides comprehensive rate limiting and access monitoring for the `/user/[username]` endpoints to prevent bot abuse.

## Features

- **Rate Limiting**: 10 requests per 60 seconds per IP address
- **IP Logging**: All access attempts are logged with IP, timestamp, username, and user agent
- **IP Blocking**: Ability to temporarily block suspicious IPs
- **Analytics Dashboard**: Monitor access patterns and identify potential abuse
- **Automatic Bot Detection**: Flags IPs with excessive requests

## Setup

### 1. Environment Variables

Add these environment variables to your `.env.local` file:

```env
# Upstash Redis (required)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# Admin dashboard access (optional but recommended)
ADMIN_TOKEN=your_secure_admin_token
```

### 2. Rate Limiting Configuration

The rate limiting is configured in `middleware.ts`:

- **Limit**: 10 requests per 60 seconds per IP
- **Window**: Sliding window of 60 seconds
- **Storage**: Upstash Redis for distributed rate limiting

To adjust the rate limit, modify the `Ratelimit` configuration:

```typescript
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "60 s"), // 10 requests per 60 seconds
  analytics: true,
});
```

### 3. IP Blocking

IPs can be blocked automatically or manually:

- **Automatic**: IPs exceeding 100 requests per day are flagged as suspicious
- **Manual**: Use the admin dashboard or API to block specific IPs

## Usage

### Monitoring Access Logs

Access logs are automatically written to the console and stored in Redis. Each log entry includes:

- Timestamp
- IP address
- Username accessed
- User agent
- Success/failure status

### Admin Dashboard

Access the admin dashboard at `/admin` using your admin token to:

- View analytics and daily statistics
- Monitor top requesting IPs
- Investigate specific IP addresses
- Block/unblock IPs manually

### API Endpoints

#### GET /api/admin

Query parameters:

- `action=analytics&days=7` - Get analytics for last N days
- `action=top-ips&date=2024-01-01` - Get top IPs for a specific date
- `action=check-ip&ip=1.2.3.4` - Check details for a specific IP

#### POST /api/admin

Request body:

```json
{
  "action": "block",
  "ip": "1.2.3.4",
  "duration": 3600
}
```

```json
{
  "action": "unblock",
  "ip": "1.2.3.4"
}
```

## Response Headers

The middleware adds rate limiting headers to all responses:

- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Unix timestamp when the window resets
- `Retry-After`: Seconds to wait before retrying (when rate limited)

## Error Responses

### Rate Limited (429)

```json
{
  "error": "Too many requests",
  "message": "You have exceeded the rate limit. Please try again later.",
  "limit": 10,
  "remaining": 0,
  "reset": "2024-01-01T12:00:00.000Z"
}
```

### IP Blocked (403)

```json
{
  "error": "Access denied",
  "message": "Your IP address has been temporarily blocked due to suspicious activity."
}
```

## Monitoring and Alerts

### Log Patterns

Watch for these patterns in your logs:

```
[USER_ACCESS] 2024-01-01T12:00:00.000Z | IP: 1.2.3.4 | User: player123 | Success: true | UA: Mozilla/5.0...
[RATE_LIMITED] IP 1.2.3.4 exceeded rate limit for /user/player123
[BLOCKED_IP] Blocked IP 1.2.3.4 attempted to access /user/player123
```

### Redis Keys

The system uses these Redis key patterns:

- `upstash-ratelimit:*` - Rate limiting data
- `daily_access:YYYY-MM-DD:IP` - Daily access counts
- `blocked_ip:IP` - Blocked IP addresses
- `access_logs:*` - Access log entries (24h TTL)

### Analytics Data

Daily statistics are stored for 7 days and include:

- Total requests per day
- Unique IP addresses per day
- Per-IP request counts

## Performance Impact

- **Middleware Overhead**: ~1-2ms per request for rate limit check
- **Redis Operations**: 2-3 Redis calls per request (check limit, log access, check if blocked)
- **Memory Usage**: Minimal, all state stored in Redis
- **CPU Impact**: Negligible

## Security Considerations

1. **Admin Token**: Use a strong, randomly generated admin token
2. **Redis Security**: Ensure your Upstash Redis instance is properly secured
3. **IP Spoofing**: The system checks multiple headers for real client IP
4. **Rate Limit Bypass**: Consider implementing additional protection at CDN level

## Troubleshooting

### High Memory Usage

If Redis memory usage is high:

1. Reduce log retention period in `logAccess()` function
2. Implement log rotation for access logs
3. Adjust daily access count TTL

### False Positives

If legitimate users are being rate limited:

1. Increase rate limit threshold
2. Implement user authentication bypass
3. Whitelist known good IPs

### Missing Logs

If logs are not appearing:

1. Check Redis connection
2. Verify environment variables
3. Check console output for Redis errors

## Development

To test the rate limiting locally:

```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local

# Start development server
bun dev

# Test rate limiting
for i in {1..15}; do curl http://localhost:3000/user/testplayer; done
```
