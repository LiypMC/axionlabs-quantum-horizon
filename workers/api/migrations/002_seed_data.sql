-- Seed data for AxionLabs Enterprise Platform

-- Create default organization (using existing schema)
INSERT OR IGNORE INTO organizations (id, name, slug, subscription_plan, max_users) 
VALUES ('default-org', 'AxionsLab', 'axionslab', 'enterprise', 1000);

-- Create demo user (using existing schema)
INSERT OR IGNORE INTO users (id, email, full_name, role, organization_id) 
VALUES (
    'demo-user', 
    'demo@axionslab.com', 
    'Demo User', 
    'user', 
    'default-org'
);