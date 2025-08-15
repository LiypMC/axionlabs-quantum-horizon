# AxionLabs API - Cloudflare Workers

Enterprise-grade API backend for AxionLabs platform built on Cloudflare Workers.

## 🚀 Features

- **Serverless Architecture**: Built on Cloudflare Workers for global edge deployment
- **TypeScript**: Full type safety and excellent developer experience
- **Enterprise Security**: JWT authentication, RBAC, and comprehensive audit logging
- **Scalable Database**: Cloudflare D1 (SQLite) for serverless SQL operations
- **AI Integration**: Cloudflare Workers AI for LLM capabilities
- **Cross-Domain Auth**: Seamless authentication across subdomains
- **Comprehensive Testing**: Jest-based testing with 100% coverage goals

## 📁 Project Structure

```
src/
├── index.ts              # Main worker entry point
├── types/                # TypeScript type definitions
├── routes/               # API route handlers
│   └── health.ts        # Health check endpoints
├── middleware/           # Request middleware
│   ├── cors.ts          # CORS handling
│   ├── error.ts         # Error handling
│   ├── logging.ts       # Request logging
│   └── validation.ts    # Input validation
├── services/            # Business logic services
│   └── database.ts      # Database operations
└── utils/               # Utility functions
    └── response.ts      # Response helpers

database/
├── schema.sql           # Database schema
├── indexes.sql          # Performance indexes
└── seed.sql            # Development seed data

tests/
├── setup.ts            # Test configuration
└── health.test.ts      # Health endpoint tests
```

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Wrangler CLI (`npm install -g wrangler`)
- Cloudflare account

### Installation

```bash
# Install dependencies
npm install

# Login to Cloudflare (first time only)
wrangler auth login

# Start development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run deploy` - Deploy to development environment
- `npm run deploy:staging` - Deploy to staging environment  
- `npm run deploy:production` - Deploy to production environment
- `npm test` - Run test suite
- `npm run type-check` - Run TypeScript type checking

## 🗄️ Database Setup

### Create D1 Database

```bash
# Create new D1 database
wrangler d1 create axionlabs-main

# Update wrangler.toml with database ID
# Uncomment the [[d1_databases]] section and add your database ID

# Apply schema
wrangler d1 execute axionlabs-main --file=./database/schema.sql

# Apply indexes
wrangler d1 execute axionlabs-main --file=./database/indexes.sql

# Seed development data (optional)
wrangler d1 execute axionlabs-main --file=./database/seed.sql
```

### Local Development Database

```bash
# Create local database for development
wrangler d1 execute axionlabs-main --local --file=./database/schema.sql
wrangler d1 execute axionlabs-main --local --file=./database/indexes.sql
wrangler d1 execute axionlabs-main --local --file=./database/seed.sql
```

## 🔧 Configuration

### Environment Variables

Update `wrangler.toml` with your configuration:

```toml
[vars]
ENVIRONMENT = "development"
CORS_ORIGIN = "*"
JWT_SECRET = "your-jwt-secret"
GOOGLE_OAUTH_CLIENT_ID = "your-google-client-id"
GOOGLE_OAUTH_CLIENT_SECRET = "your-google-client-secret"
GITHUB_OAUTH_CLIENT_ID = "your-github-client-id"
GITHUB_OAUTH_CLIENT_SECRET = "your-github-client-secret"
```

### Cloudflare Services

Configure the following Cloudflare services in `wrangler.toml`:

- **D1 Database**: For SQL data storage
- **KV Namespace**: For session management
- **R2 Bucket**: For file storage
- **Workers AI**: For LLM capabilities

## 📡 API Endpoints

### Health Checks
- `GET /health/ping` - Basic health check
- `GET /health/ready` - Readiness check with dependencies
- `GET /health/metrics` - System metrics

### Authentication (Coming Soon)
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `GET /auth/oauth/google` - Google OAuth
- `GET /auth/oauth/github` - GitHub OAuth

### API v1 (Coming Soon)
- `GET /v1/users/profile` - User profile
- `GET /v1/conversations` - List conversations
- `POST /v1/conversations` - Create conversation
- `POST /v1/ai/chat` - AI chat completion

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test health.test.ts
```

## 🚀 Deployment

### Development
```bash
npm run deploy
```

### Staging
```bash
npm run deploy:staging
```

### Production
```bash
npm run deploy:production
```

## 🔒 Security

- JWT-based authentication with secure token handling
- CORS protection with configurable origins
- Input validation using Zod schemas
- SQL injection prevention through prepared statements
- Comprehensive audit logging
- Rate limiting and DDoS protection via Cloudflare

## 📊 Monitoring

- Request logging with performance metrics
- Error tracking and reporting
- Health check endpoints for monitoring systems
- Usage analytics and billing tracking

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes with tests
3. Ensure all tests pass
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details