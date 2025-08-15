# AxionLabs Auth Frontend - Deployment Commands

## Build Commands
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Development server
npm run dev
```

## Cloudflare Pages Deployment Commands
```bash
# Deploy to Cloudflare Pages
wrangler pages deploy dist --project-name axionlabs-auth-frontend

# Deploy to production environment
wrangler pages deploy dist --project-name axionlabs-auth-frontend --env production

# Deploy to preview environment
wrangler pages deploy dist --project-name axionlabs-auth-frontend --env preview
```

## Custom Domain Setup Commands
```bash
# Add custom domain (after initial deployment)
wrangler pages domain add user.axionhosting.com --project-name axionlabs-auth-frontend

# List domains
wrangler pages domain list --project-name axionlabs-auth-frontend

# Remove domain
wrangler pages domain remove user.axionhosting.com --project-name axionlabs-auth-frontend
```

## Project Management Commands
```bash
# List all pages projects
wrangler pages project list

# Delete project (if needed)
wrangler pages project delete axionlabs-auth-frontend

# View deployment logs
wrangler pages deployment tail --project-name axionlabs-auth-frontend
```

## Environment Variables (if needed)
```bash
# Set environment variable
wrangler pages secret put VITE_API_URL --project-name axionlabs-auth-frontend

# List environment variables
wrangler pages secret list --project-name axionlabs-auth-frontend
```

## Complete Deployment Process
```bash
# 1. Build the project
npm run build

# 2. Deploy to Cloudflare Pages
wrangler pages deploy dist --project-name axionlabs-auth-frontend

# 3. (Optional) Add custom domain after first deployment
wrangler pages domain add user.axionhosting.com --project-name axionlabs-auth-frontend
```

## Troubleshooting Commands
```bash
# Check wrangler version
wrangler --version

# Update wrangler
npm install -g wrangler@latest

# Login to Cloudflare (if not already logged in)
wrangler auth login

# Whoami check
wrangler auth whoami
```