# Auth Frontend Deployment Guide

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
cd auth-frontend
npm install
```

### 3. Create Cloudflare Pages Project

```bash
wrangler pages project create axionlabs-auth-frontend
```

## Configuration

### Environment Variables

**Production:**
```bash
VITE_API_URL=https://api.axionshosting.com
VITE_ENVIRONMENT=production
```

**Staging:**
```bash
VITE_API_URL=https://staging-api.axionshosting.com
VITE_ENVIRONMENT=staging
```

## Deployment

### 1. Build and Deploy to Staging

```bash
npm run build
npm run deploy:staging
```

### 2. Build and Deploy to Production

```bash
npm run build
npm run deploy
```

### 3. Configure Custom Domain

1. Go to Cloudflare Pages dashboard
2. Select your project
3. Go to "Custom domains"
4. Add `user.axionhosting.com`
5. Update DNS records as instructed

## Testing Deployment

### 1. Test Login Page

Visit: `https://user.axionhosting.com/auth/login`

Expected: Professional login form with social auth buttons

### 2. Test Cross-Domain Flow

Visit: `https://user.axionhosting.com/auth/login?redirect=chat.axionslab.com&app=gideon`

Expected: App-specific login message for Gideon

### 3. Test OAuth Flow

Click Google/GitHub buttons and verify OAuth redirect flow

## Next Steps

After successful deployment:

1. Update main site (`axionslab.com`) sign-in links to point to `user.axionhosting.com/auth`
2. Test complete authentication flow across domains
3. Monitor logs and performance
4. Set up alerting for errors

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (requires 18+)
   - Verify all dependencies installed
   - Check TypeScript errors

2. **Routing Issues**
   - Ensure `_redirects` file is in public folder
   - Verify SPA routing configuration

3. **API Connection**
   - Check VITE_API_URL environment variable
   - Verify CORS settings on API
   - Test API endpoints directly

4. **Domain Configuration**
   - Verify DNS propagation
   - Check SSL certificate status
   - Confirm custom domain setup

### Debug Commands

```bash
# Test local build
npm run build && npm run preview

# Check environment variables
echo $VITE_API_URL

# Test API connection
curl https://api.axionshosting.com/health/ping
```