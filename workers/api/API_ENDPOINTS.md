# AxionLabs API Endpoints

Base URL: `https://api.axionshosting.com`

## Authentication Required

All authenticated endpoints require an `Authorization: Bearer <token>` header.

## Health & Status

### `GET /health/ping`
Basic health check for monitoring systems.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "service": "axionlabs-api"
  }
}
```

### `GET /health/ready`
Readiness check with dependency status.

### `GET /health/metrics`
System metrics and performance data.

## Authentication Endpoints

### `POST /auth/login`
Authenticate user with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "userpassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "full_name": "User Name",
      "role": "user"
    },
    "access_token": "jwt-access-token",
    "refresh_token": "jwt-refresh-token",
    "expires_at": "2024-01-01T00:15:00.000Z"
  }
}
```

### `POST /auth/register`
Register new user account.

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "SecurePassword123!",
  "full_name": "New User"
}
```

### `POST /auth/refresh`
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refresh_token": "jwt-refresh-token"
}
```

### `POST /auth/logout`
**Auth Required:** Yes  
Invalidate current session.

### `GET /auth/me`
**Auth Required:** Yes  
Get current user information.

### `GET /auth/oauth/google`
Initiate Google OAuth flow.

**Query Parameters:**
- `redirect_uri` (optional): Where to redirect after auth
- `app` (optional): Target application (main, chat, admin)

### `GET /auth/oauth/github`
Initiate GitHub OAuth flow.

### `POST /auth/oauth/callback`
Handle OAuth provider callback.

## Cross-Domain Authentication

### `GET /auth/check-session`
Check if user has active session and redirect appropriately.

**Query Parameters:**
- `domain` (required): Target domain (e.g., chat.axionslab.com)
- `app` (optional): Target application
- `return_url` (optional): URL to return to after auth

### `POST /auth/cross-domain/initiate`
**Auth Required:** Yes  
Initiate cross-domain authentication for authenticated user.

**Request Body:**
```json
{
  "target_domain": "chat.axionslab.com",
  "app": "gideon",
  "return_url": "/conversation/abc123"
}
```

### `POST /auth/cross-domain/callback`
Handle cross-domain authentication callback.

**Request Body:**
```json
{
  "temp_token": "temporary-jwt-token",
  "target_domain": "chat.axionslab.com",
  "return_url": "/"
}
```

### `GET /auth/cross-domain/status`
Get cross-domain authentication status.

**Query Parameters:**
- `domain` (required): Target domain to check

**Response (Not Authenticated):**
```json
{
  "success": true,
  "data": {
    "authenticated": false,
    "target_domain": "chat.axionslab.com",
    "auth_url": "https://axionslab.com/auth?redirect=..."
  }
}
```

**Response (Authenticated):**
```json
{
  "success": true,
  "data": {
    "authenticated": true,
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "full_name": "User Name",
      "role": "user"
    },
    "target_domain": "chat.axionslab.com",
    "expires_at": "2024-01-01T00:15:00.000Z"
  }
}
```

### `POST /auth/sessions/temp`
**Auth Required:** Yes  
Generate temporary cross-domain token.

**Query Parameters:**
- `domain` (required): Target domain

### `POST /auth/logout-all`
**Auth Required:** Yes  
Logout from all domains and applications.

## Application Information

### `GET /auth/app-info`
Get application-specific login information.

**Query Parameters:**
- `app` (optional): Application name (chat, admin, main)
- `domain` (optional): Target domain

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "Sign in to access Gideon AI",
    "description": "Continue to the AI chat interface",
    "app_name": "Gideon Chat",
    "redirect_hint": "You will be redirected to the chat application",
    "target_domain": "chat.axionslab.com",
    "auth_endpoints": {
      "login": "/auth/login",
      "register": "/auth/register",
      "oauth_google": "/auth/oauth/google",
      "oauth_github": "/auth/oauth/github"
    }
  }
}
```

### `GET /auth/domains/validate`
Validate if domain is allowed for cross-domain auth.

**Query Parameters:**
- `domain` (required): Domain to validate

**Response:**
```json
{
  "success": true,
  "data": {
    "domain": "chat.axionslab.com",
    "is_valid": true,
    "allowed_apps": ["main", "chat"]
  }
}
```

## API Information

### `GET /`
Get API information and available endpoints.

### `GET /v1`
Get API v1 information and endpoint list.

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Common Error Codes

- `400` - Bad Request (validation errors, missing parameters)
- `401` - Unauthorized (invalid or missing authentication)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (endpoint doesn't exist)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## Rate Limits

- **Authentication endpoints**: 100 requests per hour per IP
- **General endpoints**: 1000 requests per hour per user
- **Health endpoints**: No rate limiting

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: When the rate limit resets (ISO 8601 timestamp)

## CORS

The API supports CORS with the following allowed origins:
- `https://axionslab.com`
- `https://chat.axionslab.com`
- `https://admin.axionslab.com`
- `https://docs.axionslab.com`
- `http://localhost:*` (development only)

## Security Headers

All responses include security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy: ...`

## Demo Credentials

For testing purposes, you can use these demo credentials:

- **Email**: `demo@axionslab.com`
- **Password**: `demo123`
- **Role**: `user`

## Integration Examples

### Frontend Authentication Check

```javascript
// Check if user is authenticated for chat app
const response = await fetch('https://api.axionshosting.com/auth/cross-domain/status?domain=chat.axionslab.com');
const { data } = await response.json();

if (!data.authenticated) {
  // Redirect to login
  window.location.href = data.auth_url;
} else {
  // User is authenticated, proceed with app
  console.log('User:', data.user);
}
```

### Login Flow

```javascript
// Login user
const loginResponse = await fetch('https://api.axionshosting.com/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password'
  })
});

const { data } = await loginResponse.json();
const accessToken = data.access_token;

// Store token and make authenticated requests
localStorage.setItem('access_token', accessToken);
```

### Cross-Domain Flow

```javascript
// Check session and redirect if needed
const checkResponse = await fetch(
  'https://api.axionshosting.com/auth/check-session?domain=chat.axionslab.com&app=gideon&return_url=/conversation/123'
);

// This will either redirect to login or to the callback with a temp token
if (checkResponse.redirected) {
  window.location.href = checkResponse.url;
}
```