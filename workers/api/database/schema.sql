-- AxionLabs Enterprise Database Schema
-- Cloudflare D1 (SQLite) Compatible

-- Users table with enterprise features
CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'enterprise', 'super_admin')),
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
    organization_id TEXT,
    department TEXT,
    job_title TEXT,
    phone_number TEXT,
    timezone TEXT DEFAULT 'UTC',
    language TEXT DEFAULT 'en',
    email_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    password_hash TEXT NOT NULL,
    last_login_at DATETIME,
    login_count INTEGER DEFAULT 0,
    account_status TEXT DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'pending', 'deactivated')),
    onboarding_completed BOOLEAN DEFAULT FALSE,
    preferences TEXT, -- JSON blob
    metadata TEXT, -- JSON blob for custom fields
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- Organizations for enterprise features
CREATE TABLE organizations (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    domain TEXT UNIQUE,
    logo_url TEXT,
    description TEXT,
    industry TEXT,
    company_size TEXT CHECK (company_size IN ('1-10', '11-50', '51-200', '201-1000', '1000+')),
    billing_email TEXT,
    subscription_plan TEXT DEFAULT 'free',
    subscription_status TEXT DEFAULT 'active',
    max_users INTEGER DEFAULT 5,
    current_users INTEGER DEFAULT 0,
    features TEXT, -- JSON array of enabled features
    settings TEXT, -- JSON blob for org-specific settings
    branding TEXT, -- JSON blob for custom branding
    security_settings TEXT, -- JSON blob for security policies
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);

-- Chat conversations with enterprise features
CREATE TABLE conversations (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,
    organization_id TEXT,
    title TEXT NOT NULL,
    model TEXT DEFAULT 'llama-3.2-1b-preview',
    system_prompt TEXT,
    temperature REAL DEFAULT 0.7,
    max_tokens INTEGER DEFAULT 2048,
    conversation_type TEXT DEFAULT 'chat' CHECK (conversation_type IN ('chat', 'analysis', 'code_review', 'brainstorm')),
    tags TEXT, -- JSON array
    is_pinned BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    is_shared BOOLEAN DEFAULT FALSE,
    shared_with TEXT, -- JSON array of user IDs or organization sharing settings
    folder_id TEXT,
    last_message_at DATETIME,
    message_count INTEGER DEFAULT 0,
    token_usage INTEGER DEFAULT 0,
    estimated_cost REAL DEFAULT 0.0,
    metadata TEXT, -- JSON blob
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    FOREIGN KEY (folder_id) REFERENCES folders(id)
);

-- Messages with rich content support
CREATE TABLE messages (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    conversation_id TEXT NOT NULL,
    user_id TEXT,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    content_type TEXT DEFAULT 'text' CHECK (content_type IN ('text', 'markdown', 'code', 'image', 'file')),
    attachments TEXT, -- JSON array of file references
    model_used TEXT,
    tokens_used INTEGER DEFAULT 0,
    processing_time REAL, -- in seconds
    confidence_score REAL,
    feedback_rating INTEGER CHECK (feedback_rating BETWEEN 1 AND 5),
    feedback_comment TEXT,
    is_edited BOOLEAN DEFAULT FALSE,
    edit_history TEXT, -- JSON array of previous versions
    metadata TEXT, -- JSON blob for additional data
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Folders for conversation organization
CREATE TABLE folders (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,
    organization_id TEXT,
    name TEXT NOT NULL,
    parent_folder_id TEXT,
    color TEXT DEFAULT '#6366f1',
    icon TEXT DEFAULT 'folder',
    description TEXT,
    is_shared BOOLEAN DEFAULT FALSE,
    shared_permissions TEXT, -- JSON blob
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    FOREIGN KEY (parent_folder_id) REFERENCES folders(id)
);

-- OAuth providers and tokens
CREATE TABLE oauth_providers (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,
    provider TEXT NOT NULL CHECK (provider IN ('google', 'github', 'microsoft', 'slack')),
    provider_user_id TEXT NOT NULL,
    provider_username TEXT,
    provider_email TEXT,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at DATETIME,
    scope TEXT,
    connected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_used_at DATETIME,
    is_primary BOOLEAN DEFAULT FALSE,
    metadata TEXT, -- JSON blob for provider-specific data
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(provider, provider_user_id)
);

-- Sessions for authentication
CREATE TABLE sessions (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,
    token_hash TEXT UNIQUE NOT NULL,
    refresh_token_hash TEXT UNIQUE,
    device_info TEXT, -- JSON blob
    ip_address TEXT,
    user_agent TEXT,
    location TEXT, -- JSON blob with country, city, etc.
    is_active BOOLEAN DEFAULT TRUE,
    expires_at DATETIME NOT NULL,
    last_activity_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- API keys for programmatic access
CREATE TABLE api_keys (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,
    organization_id TEXT,
    name TEXT NOT NULL,
    key_hash TEXT UNIQUE NOT NULL,
    permissions TEXT, -- JSON array of permissions
    rate_limit_per_hour INTEGER DEFAULT 1000,
    usage_count INTEGER DEFAULT 0,
    last_used_at DATETIME,
    expires_at DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- Usage analytics and billing
CREATE TABLE usage_logs (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,
    organization_id TEXT,
    conversation_id TEXT,
    action_type TEXT NOT NULL CHECK (action_type IN ('message', 'api_call', 'file_upload', 'export')),
    model_used TEXT,
    tokens_consumed INTEGER DEFAULT 0,
    cost REAL DEFAULT 0.0,
    metadata TEXT, -- JSON blob
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);

-- File uploads and attachments
CREATE TABLE files (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,
    organization_id TEXT,
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT,
    storage_path TEXT NOT NULL, -- Cloudflare R2 path
    is_public BOOLEAN DEFAULT FALSE,
    upload_session_id TEXT,
    virus_scan_status TEXT DEFAULT 'pending' CHECK (virus_scan_status IN ('pending', 'clean', 'infected', 'error')),
    metadata TEXT, -- JSON blob
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- Audit logs for compliance
CREATE TABLE audit_logs (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT,
    organization_id TEXT,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    details TEXT, -- JSON blob
    ip_address TEXT,
    user_agent TEXT,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- Feature flags and A/B testing
CREATE TABLE feature_flags (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    is_enabled BOOLEAN DEFAULT FALSE,
    rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage BETWEEN 0 AND 100),
    target_users TEXT, -- JSON array of user IDs
    target_organizations TEXT, -- JSON array of org IDs
    conditions TEXT, -- JSON blob for complex targeting
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);