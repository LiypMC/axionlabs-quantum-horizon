-- Performance indexes for AxionLabs database

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(account_status);
CREATE INDEX idx_users_created ON users(created_at);

-- Organization indexes
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_domain ON organizations(domain);
CREATE INDEX idx_organizations_status ON organizations(subscription_status);

-- Conversation indexes
CREATE INDEX idx_conversations_user ON conversations(user_id);
CREATE INDEX idx_conversations_org ON conversations(organization_id);
CREATE INDEX idx_conversations_updated ON conversations(updated_at DESC);
CREATE INDEX idx_conversations_type ON conversations(conversation_type);
CREATE INDEX idx_conversations_folder ON conversations(folder_id);
CREATE INDEX idx_conversations_archived ON conversations(is_archived);

-- Message indexes
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_user ON messages(user_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_messages_role ON messages(role);

-- Folder indexes
CREATE INDEX idx_folders_user ON folders(user_id);
CREATE INDEX idx_folders_org ON folders(organization_id);
CREATE INDEX idx_folders_parent ON folders(parent_folder_id);

-- OAuth provider indexes
CREATE INDEX idx_oauth_user ON oauth_providers(user_id);
CREATE INDEX idx_oauth_provider ON oauth_providers(provider);
CREATE INDEX idx_oauth_provider_user ON oauth_providers(provider_user_id);

-- Session indexes
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token_hash);
CREATE INDEX idx_sessions_active ON sessions(is_active);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);

-- API key indexes
CREATE INDEX idx_api_keys_user ON api_keys(user_id);
CREATE INDEX idx_api_keys_org ON api_keys(organization_id);
CREATE INDEX idx_api_keys_active ON api_keys(is_active);
CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);

-- Usage analytics indexes
CREATE INDEX idx_usage_user ON usage_logs(user_id);
CREATE INDEX idx_usage_org ON usage_logs(organization_id);
CREATE INDEX idx_usage_timestamp ON usage_logs(timestamp DESC);
CREATE INDEX idx_usage_action ON usage_logs(action_type);

-- File indexes
CREATE INDEX idx_files_user ON files(user_id);
CREATE INDEX idx_files_org ON files(organization_id);
CREATE INDEX idx_files_uploaded ON files(uploaded_at DESC);
CREATE INDEX idx_files_type ON files(file_type);

-- Audit log indexes
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_org ON audit_logs(organization_id);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_resource ON audit_logs(resource_type);

-- Feature flag indexes
CREATE INDEX idx_feature_flags_name ON feature_flags(name);
CREATE INDEX idx_feature_flags_enabled ON feature_flags(is_enabled);