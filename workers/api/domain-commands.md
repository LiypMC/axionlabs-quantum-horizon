# API Backend - Custom Domain Commands

## Current Deployment
- **Worker URL**: https://axionlabs-api.a-contactnaol.workers.dev
- **Target Domain**: api.axionshosting.com

## Custom Domain Setup Commands

### 1. Add Custom Domain to Worker
```bash
# Add custom domain to the worker
wrangler custom-domains add api.axionshosting.com --zone-id YOUR_ZONE_ID

# Alternative: Add route (if using routes instead of custom domains)
wrangler route add api.axionshosting.com/* axionlabs-api
```

### 2. DNS Configuration
You need to add these DNS records in your domain provider (e.g., Cloudflare, GoDaddy, etc.):

```
Type: CNAME
Name: api.axionshosting.com
Value: axionlabs-api.a-contactnaol.workers.dev
TTL: Auto/300
```

### 3. Verify Domain Setup
```bash
# List all routes
wrangler route list

# Test the API endpoint
curl https://api.axionshosting.com/health
```

## Auth Frontend Domain Commands

### Add Custom Domain to Pages Project
```bash
# Add custom domain to the pages project
wrangler pages domain add user.axionhosting.com --project-name axionlabs-auth-frontend
```

### DNS Configuration for Auth Frontend
```
Type: CNAME  
Name: user.axionhosting.com
Value: axionlabs-auth-frontend.pages.dev
TTL: Auto/300
```

## Complete Domain Configuration Process

1. **Configure DNS records** in your domain provider
2. **Add domains to Cloudflare**:
   ```bash
   # For API (Worker)
   wrangler route add api.axionshosting.com/* axionlabs-api
   
   # For Auth Frontend (Pages)
   wrangler pages domain add user.axionhosting.com --project-name axionlabs-auth-frontend
   ```
3. **Test endpoints**:
   ```bash
   curl https://api.axionshosting.com/health
   curl https://user.axionhosting.com
   ```

## Environment Variables Update
After domain setup, update the auth frontend to use the custom API domain:

```bash
# Set API URL for production
wrangler pages secret put VITE_API_URL --project-name axionlabs-auth-frontend
# Enter: https://api.axionshosting.com
```