# AxionLabs Enterprise Infrastructure - Deployment Guide

## Current Deployment Status ✅

### API Backend (Cloudflare Workers)
- **Status**: ✅ Deployed
- **URL**: https://axionlabs-api.a-contactnaol.workers.dev
- **Target Domain**: api.axionshosting.com

### Auth Frontend (Cloudflare Pages)  
- **Status**: ✅ Deployed
- **URL**: [Pages URL from deployment]
- **Target Domain**: user.axionhosting.com

## Next Steps - Custom Domain Configuration

### 1. API Domain Setup (api.axionshosting.com)

#### Option A: Cloudflare Dashboard (Recommended)
1. Go to **Cloudflare Dashboard** → **Workers & Pages**
2. Select **axionlabs-api** worker
3. Go to **Settings** → **Domains & Routes**
4. Click **Add Custom Domain**
5. Enter: `api.axionshosting.com`
6. Follow DNS setup instructions

#### Option B: CLI Commands
```bash
# Note: May need zone configuration first
wrangler zone add axionshosting.com
wrangler route add api.axionshosting.com/* axionlabs-api
```

### 2. Auth Frontend Domain Setup (user.axionhosting.com)

#### Cloudflare Dashboard (Recommended)
1. Go to **Cloudflare Dashboard** → **Workers & Pages**
2. Select **axionlabs-auth-frontend** pages project
3. Go to **Custom Domains**
4. Click **Set up a custom domain**
5. Enter: `user.axionhosting.com`
6. Follow DNS setup instructions

### 3. DNS Configuration Required

Add these DNS records in your domain provider:

```dns
# For API Backend
Type: CNAME
Name: api
Host: api.axionshosting.com
Value: axionlabs-api.a-contactnaol.workers.dev
TTL: 300

# For Auth Frontend  
Type: CNAME
Name: user
Host: user.axionhosting.com
Value: [pages-deployment-url].pages.dev
TTL: 300
```

### 4. Update Environment Variables

Once domains are configured, update the auth frontend:

```bash
# Set production API URL
wrangler pages secret put VITE_API_URL --project-name axionlabs-auth-frontend
# Enter: https://api.axionshosting.com

# Redeploy auth frontend with new API URL
cd auth-frontend
npm run build
wrangler pages deploy dist --project-name axionlabs-auth-frontend
```

## Testing Cross-Domain Authentication

After domain setup, test the complete flow:

1. **API Health Check**:
   ```bash
   curl https://api.axionshosting.com/health
   ```

2. **Auth Page Access**:
   ```bash
   curl https://user.axionhosting.com
   ```

3. **Cross-Domain Login Flow**:
   - Visit: https://axionslab.com
   - Should redirect to: https://user.axionhosting.com/auth/login?redirect=https://axionslab.com&app=main
   - After login, should redirect back with authentication

## Main Site Integration

Update main site (axionslab.com) to redirect authentication to new domain:

```javascript
// Replace existing auth redirects with:
window.location.href = 'https://user.axionhosting.com/auth/login?redirect=' + 
                      encodeURIComponent(window.location.href) + '&app=main'
```

## Production Deployment Checklist

- [x] API backend deployed to Cloudflare Workers
- [x] Auth frontend deployed to Cloudflare Pages  
- [ ] Custom domains configured (api.axionshosting.com, user.axionhosting.com)
- [ ] DNS records added
- [ ] Environment variables updated
- [ ] Cross-domain authentication tested
- [ ] Main site updated to use new auth domain
- [ ] SSL certificates verified
- [ ] Performance monitoring setup

## Security Notes

- JWT tokens are properly configured with secure settings
- Cross-domain authentication uses temporary tokens for security
- All communications use HTTPS
- Database connections are encrypted
- Rate limiting is implemented on API endpoints

## Support & Monitoring

- **API Logs**: Available in Cloudflare Workers dashboard
- **Auth Frontend Logs**: Available in Cloudflare Pages dashboard
- **Database Monitoring**: Available in D1 dashboard
- **Performance**: Monitor via Cloudflare Analytics