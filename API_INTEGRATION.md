# AxionLabs Authentication API Integration Guide

This guide explains how external product applications can integrate with AxionLabs centralized authentication system.

## Overview

AxionLabs provides three main endpoints for external app integration:

1. **Login/Signup Page**: `/auth` with redirect support
2. **Session Check API**: `GET /api/auth/session` 
3. **Account Linking API**: `POST /api/link-account`

## 1. Authentication Flow

### Step 1: Redirect to AxionLabs Login

Redirect users to AxionLabs auth page with your app's callback URL:

```
https://axionslab.com/auth?redirect_to=https://yourapp.com/link-account
```

### Step 2: Handle Callback

After successful login, the user will be redirected back to your `redirect_to` URL. The user will have a Supabase session cookie set for `axionslab.com`.

## 2. Session Check API

**Endpoint**: `GET https://axionslab.com/api/auth/session`

Check if a user is logged in to AxionLabs.

### Request Examples

```javascript
// Using fetch with credentials
const response = await fetch('https://axionslab.com/api/auth/session', {
  method: 'GET',
  credentials: 'include', // Important: includes cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
```

### Response Format

**Logged In**:
```json
{
  "isLoggedIn": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com"
  }
}
```

**Not Logged In**:
```json
{
  "isLoggedIn": false
}
```

## 3. Account Linking API

**Endpoint**: `POST https://axionslab.com/api/link-account`

Link an authenticated AxionLabs user with your app's user ID.

### Request Format

```javascript
const response = await fetch('https://axionslab.com/api/link-account', {
  method: 'POST',
  credentials: 'include', // Important: includes cookies
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    externalAppUserId: 'your-app-user-id-123'
  })
});

const data = await response.json();
```

### Response Format

**Success**:
```json
{
  "success": true
}
```

**Error Examples**:
```json
{
  "error": "Authorization required"
}
```

```json
{
  "error": "Account already linked"
}
```

```json
{
  "error": "externalAppUserId is required"
}
```

## 4. Complete Integration Example

```javascript
class AxionLabsAuth {
  constructor() {
    this.baseURL = 'https://axionslab.com';
  }

  // Redirect to AxionLabs login
  redirectToLogin(callbackURL) {
    const loginURL = `${this.baseURL}/auth?redirect_to=${encodeURIComponent(callbackURL)}`;
    window.location.href = loginURL;
  }

  // Check if user is logged in
  async checkSession() {
    try {
      const response = await fetch(`${this.baseURL}/api/auth/session`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return await response.json();
    } catch (error) {
      console.error('Session check failed:', error);
      return { isLoggedIn: false };
    }
  }

  // Link AxionLabs account with your app user
  async linkAccount(externalAppUserId) {
    try {
      const response = await fetch(`${this.baseURL}/api/link-account`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ externalAppUserId })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Account linking failed:', error);
      return { error: 'Network error' };
    }
  }
}

// Usage example
const auth = new AxionLabsAuth();

// 1. Check if user is already logged in
const session = await auth.checkSession();

if (!session.isLoggedIn) {
  // 2. Redirect to login if not authenticated
  auth.redirectToLogin('https://yourapp.com/auth-callback');
} else {
  // 3. User is logged in, link accounts
  const linkResult = await auth.linkAccount('your-app-user-123');
  
  if (linkResult.success) {
    console.log('Account successfully linked!');
  } else {
    console.error('Linking failed:', linkResult.error);
  }
}
```

## 5. Database Schema

The `linked_accounts` table stores the relationship between AxionLabs users and external app users:

```sql
create table linked_accounts (
  id uuid primary key default gen_random_uuid(),
  supabase_user_id uuid references auth.users(id),
  external_user_id text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Ensure one-to-one mapping per app
create unique index idx_linked_accounts_unique 
on linked_accounts(supabase_user_id, external_user_id);
```

## 6. Security Considerations

- All endpoints support CORS for cross-origin requests
- Authentication is handled via secure HTTP-only cookies
- Rate limiting is implemented on all endpoints
- Input validation prevents SQL injection and other attacks
- HTTPS is required for all API calls in production

## 7. Error Handling

Always handle potential errors in your integration:

- Network failures
- Authentication timeouts
- Rate limiting (429 responses)
- Validation errors (400 responses)
- Server errors (500 responses)

## 8. Testing

You can test the integration using curl:

```bash
# Test session check
curl -X GET https://axionslab.com/api/auth/session \
  -H "Content-Type: application/json" \
  --cookie-jar cookies.txt

# Test account linking
curl -X POST https://axionslab.com/api/link-account \
  -H "Content-Type: application/json" \
  --cookie cookies.txt \
  -d '{"externalAppUserId": "test-user-123"}'
```