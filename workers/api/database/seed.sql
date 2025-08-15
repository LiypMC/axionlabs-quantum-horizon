-- Seed data for AxionLabs development environment

-- Insert default organization
INSERT INTO organizations (
    id, name, slug, domain, description, 
    company_size, subscription_plan, max_users
) VALUES (
    'default-org', 'AxionLabs', 'axionlabs', 'axionslab.com',
    'Default organization for AxionLabs platform',
    '11-50', 'enterprise', 100
);

-- Insert admin user
INSERT INTO users (
    id, email, username, full_name, role, 
    organization_id, email_verified, password_hash,
    onboarding_completed, account_status
) VALUES (
    'admin-user', 'admin@axionslab.com', 'admin', 'System Administrator',
    'super_admin', 'default-org', TRUE, 
    -- This is a bcrypt hash for 'admin123' - change in production!
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    TRUE, 'active'
);

-- Insert demo user
INSERT INTO users (
    id, email, username, full_name, role,
    organization_id, email_verified, password_hash,
    onboarding_completed, account_status
) VALUES (
    'demo-user', 'demo@axionslab.com', 'demo', 'Demo User',
    'user', 'default-org', TRUE,
    -- This is a bcrypt hash for 'demo123' - change in production!
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    TRUE, 'active'
);

-- Insert sample folders
INSERT INTO folders (id, user_id, name, description, color, icon) VALUES 
('folder-work', 'demo-user', 'Work', 'Work-related conversations', '#3b82f6', 'briefcase'),
('folder-personal', 'demo-user', 'Personal', 'Personal conversations', '#10b981', 'user'),
('folder-projects', 'demo-user', 'Projects', 'Project discussions', '#f59e0b', 'folder');

-- Insert sample conversation
INSERT INTO conversations (
    id, user_id, title, model, conversation_type,
    folder_id, message_count, last_message_at
) VALUES (
    'demo-conversation', 'demo-user', 'Welcome to AxionLabs AI',
    'llama-3.2-1b-preview', 'chat', 'folder-work', 2, CURRENT_TIMESTAMP
);

-- Insert sample messages
INSERT INTO messages (conversation_id, user_id, role, content, model_used, tokens_used) VALUES 
('demo-conversation', 'demo-user', 'user', 'Hello! Can you tell me about AxionLabs AI capabilities?', NULL, 15),
('demo-conversation', NULL, 'assistant', 'Hello! I''m Gideon, AxionLabs'' AI assistant. I can help you with a wide range of tasks including answering questions, writing code, analyzing data, and creative projects. What would you like to explore today?', 'llama-3.2-1b-preview', 45);

-- Insert sample feature flags
INSERT INTO feature_flags (name, description, is_enabled, rollout_percentage) VALUES 
('voice_input', 'Enable voice input for chat', FALSE, 0),
('file_uploads', 'Allow file uploads in conversations', TRUE, 100),
('advanced_analytics', 'Show advanced usage analytics', FALSE, 25),
('dark_mode', 'Enable dark mode interface', TRUE, 100),
('collaboration', 'Enable conversation sharing and collaboration', FALSE, 0);

-- Update organization user count
UPDATE organizations SET current_users = 2 WHERE id = 'default-org';