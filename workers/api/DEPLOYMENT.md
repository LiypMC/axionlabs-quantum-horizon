# AxionLabs API Deployment Guide

## Prerequisites

1. **Cloudflare Account**: Sign up at https://cloudflare.com
2. **Wrangler CLI**: Install globally
   ```bash
   npm install -g wrangler
   ```
3. **Node.js 18+**: Required for development and deployment

## Initial Setup

### 1. Authenticate with Cloudflare

```bash
wrangler auth login
```

### 2. Install Dependencies

```bash
cd workers/api
npm install
```

### 3. Create Cloudflare D1 Database

```bash
# Create production database
wrangler d1 create axionlabs-main

# Create staging database (optional)
wrangler d1 create axionlabs-staging
```

**Important**: Copy the database ID from the output and update `wrangler.toml`

### 4. Create KV Namespace for Sessions

```bash
# Create production KV namespace
wrangler kv:namespace create "SESSIONS"

# Create staging KV namespace (optional)
wrangler kv:namespace create "SESSIONS" --preview
```

### 5. Create R2 Bucket for File Storage

```bash
# Create production R2 bucket
wrangler r2 bucket create axionlabs-files

# Create staging R2 bucket (optional)
wrangler r2 bucket create axionlabs-files-staging
```

## Configuration

### Update wrangler.toml

Replace the commented sections in `wrangler.toml` with your actual resource IDs:

```toml
# Uncomment and update with your database ID
[[d1_databases]]
binding = "DB"
database_name = "axionlabs-main"
database_id = "your-actual-database-id"

# Uncomment and update with your KV namespace ID
[[kv_namespaces]]
binding = "SESSIONS"
id = "your-actual-kv-namespace-id"

# Uncomment and update with your R2 bucket name
[[r2_buckets]]
binding = "FILES"
bucket_name = "axionlabs-files"

# Update production variables
[env.production.vars]
ENVIRONMENT = "production"
CORS_ORIGIN = "https://axionslab.com,https://chat.axionslab.com,https://admin.axionslab.com"
JWT_SECRET = "your-super-secure-jwt-secret-change-this"
GOOGLE_OAUTH_CLIENT_ID = "your-google-oauth-client-id"
GOOGLE_OAUTH_CLIENT_SECRET = "your-google-oauth-client-secret"
GITHUB_OAUTH_CLIENT_ID = "your-github-oauth-client-id"
GITHUB_OAUTH_CLIENT_SECRET = "your-github-oauth-client-secret"
```

### Set Production Secrets

For sensitive values, use Wrangler secrets instead of environment variables:

```bash
# Set JWT secret
wrangler secret put JWT_SECRET --env production

# Set OAuth secrets
wrangler secret put GOOGLE_OAUTH_CLIENT_SECRET --env production
wrangler secret put GITHUB_OAUTH_CLIENT_SECRET --env production
```

## Database Setup

### 1. Apply Database Schema

```bash
# Production database
wrangler d1 execute axionlabs-main --file=./database/schema.sql --env production

# Apply indexes for performance
wrangler d1 execute axionlabs-main --file=./database/indexes.sql --env production

# Optional: Add seed data for development/testing
wrangler d1 execute axionlabs-main --file=./database/seed.sql --env production
```

### 2. Verify Database Setup

```bash
# Check tables were created
wrangler d1 execute axionlabs-main --command="SELECT name FROM sqlite_master WHERE type='table';" --env production

# Check seed data (if applied)
wrangler d1 execute axionlabs-main --command="SELECT COUNT(*) as user_count FROM users;" --env production
```

## OAuth Setup

### Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://api.axionshosting.com/auth/oauth/callback`
   - `https://axionslab.com/auth/callback/google`

### GitHub OAuth Configuration

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create new OAuth App
3. Set Authorization callback URL:
   - `https://api.axionshosting.com/auth/oauth/callback`

## Deployment

### 1. Deploy to Staging (Optional)

```bash
npm run deploy:staging
```

### 2. Deploy to Production

```bash
# Build and deploy
npm run deploy:production
```

### 3. Verify Deployment

```bash
# Check health endpoint
curl https://api.axionshosting.com/health/ping

# Check API info
curl https://api.axionshosting.com/
```

## Custom Domain Setup

### 1. Add Custom Domain in Cloudflare Dashboard

1. Go to Workers & Pages > axionlabs-api-prod
2. Click "Custom Domains"
3. Add `api.axionshosting.com`

### 2. Update DNS Records

Add a CNAME record in your DNS:
```
api.axionshosting.com CNAME axionlabs-api-prod.your-subdomain.workers.dev
```

## Testing Deployment

### 1. Health Check

```bash
curl https://api.axionshosting.com/health/ping
```

Expected response:
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "service": "axionlabs-api"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Test Authentication

```bash
# Test login with demo user
curl -X POST https://api.axionshosting.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@axionslab.com", "password": "demo123"}'
```

### 3. Test Cross-Domain Flow

```bash
# Check cross-domain status
curl "https://api.axionshosting.com/auth/cross-domain/status?domain=chat.axionslab.com"
```

### 4. Test OAuth Redirect

Visit in browser:
```
https://api.axionshosting.com/auth/oauth/google?redirect_uri=https://axionslab.com/auth/callback
```

## Monitoring and Logs

### View Worker Logs

```bash
wrangler tail --env production
```

### Check Analytics

1. Go to Cloudflare Dashboard
2. Workers & Pages > axionlabs-api-prod
3. View metrics and analytics

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify database ID in wrangler.toml
   - Check schema was applied correctly

2. **CORS Issues**
   - Update CORS_ORIGIN environment variable
   - Ensure all domains are included

3. **OAuth Callback Issues**
   - Verify redirect URIs in OAuth provider settings
   - Check client IDs and secrets

4. **JWT Token Issues**
   - Ensure JWT_SECRET is set correctly
   - Check token expiration times

### Debug Commands

```bash
# Test local development
npm run dev

# Check environment variables
wrangler secret list --env production

# View database data
wrangler d1 execute axionlabs-main --command="SELECT * FROM users LIMIT 5;" --env production
```

## Security Checklist

- [ ] JWT_SECRET is secure and not exposed
- [ ] OAuth secrets are set via wrangler secrets
- [ ] CORS origins are restrictive
- [ ] Database has proper indexes
- [ ] All endpoints have proper authentication
- [ ] Rate limiting is configured
- [ ] Security headers are applied

## Next Steps

After successful deployment:

1. Update frontend applications to use the new API URL
2. Test all authentication flows
3. Monitor logs and performance
4. Set up alerting for errors
5. Configure backup strategy for database

## Support

If you encounter issues during deployment:

1. Check Cloudflare Workers documentation
2. Review Wrangler CLI logs
3. Verify all configuration values
4. Test individual components (database, KV, R2)
5. Check network connectivity and DNS propagation