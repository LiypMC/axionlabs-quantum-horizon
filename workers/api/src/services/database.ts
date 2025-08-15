// D1 Database service for AxionLabs
import { Env } from '../types';

export class DatabaseService {
  private db: any;

  constructor(private env: Env) {
    this.db = env.DB;
  }

  // User management
  async createUser(userData: {
    email: string;
    password_hash: string;
    full_name?: string;
    role?: string;
    organization_id?: string;
  }) {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    const stmt = this.db.prepare(`
      INSERT INTO users (id, email, password_hash, full_name, role, organization_id, email_verified, account_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    await stmt.bind(
      userId,
      userData.email,
      userData.password_hash,
      userData.full_name || null,
      userData.role || 'user',
      userData.organization_id || 'default-org',
      false,
      'active'
    ).run();

    return this.getUserById(userId);
  }

  async getUserByEmail(email: string) {
    const stmt = this.db.prepare(`
      SELECT id, email, username, full_name, avatar_url, role, subscription_tier,
             organization_id, email_verified, account_status, last_login_at,
             login_count, onboarding_completed, preferences, created_at, updated_at
      FROM users 
      WHERE email = ? AND deleted_at IS NULL
    `);
    
    const result = await stmt.bind(email).first();
    return result || null;
  }

  async getUserById(id: string) {
    const stmt = this.db.prepare(`
      SELECT id, email, username, full_name, avatar_url, role, subscription_tier,
             organization_id, email_verified, account_status, last_login_at,
             login_count, onboarding_completed, preferences, created_at, updated_at
      FROM users 
      WHERE id = ? AND deleted_at IS NULL
    `);
    
    const result = await stmt.bind(id).first();
    return result || null;
  }

  async getUserWithPassword(email: string) {
    const stmt = this.db.prepare(`
      SELECT id, email, password_hash, full_name, role, organization_id,
             email_verified, account_status, created_at, updated_at
      FROM users 
      WHERE email = ? AND deleted_at IS NULL
    `);
    
    const result = await stmt.bind(email).first();
    return result || null;
  }

  async updateUserLastLogin(userId: string): Promise<void> {
    const stmt = this.db.prepare(`
      UPDATE users 
      SET last_login_at = CURRENT_TIMESTAMP, login_count = login_count + 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    await stmt.bind(userId).run();
  }

  // Organization management
  async getOrganizationById(id: string) {
    const stmt = this.db.prepare(`
      SELECT id, name, slug, domain, logo_url, description, industry,
             company_size, subscription_plan, subscription_status,
             max_users, current_users, features, settings,
             created_at, updated_at
      FROM organizations 
      WHERE id = ? AND deleted_at IS NULL
    `);
    
    const result = await stmt.bind(id).first();
    return result || null;
  }

  // Session management
  async createSession(sessionData: {
    user_id: string;
    token_hash: string;
    refresh_token_hash?: string;
    expires_at: Date;
    device_info?: string;
    ip_address?: string;
    user_agent?: string;
  }): Promise<string> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    const stmt = this.db.prepare(`
      INSERT INTO sessions (id, user_id, token_hash, refresh_token_hash, expires_at, 
                           device_info, ip_address, user_agent, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    await stmt.bind(
      sessionId,
      sessionData.user_id,
      sessionData.token_hash,
      sessionData.refresh_token_hash || null,
      sessionData.expires_at.toISOString(),
      sessionData.device_info || null,
      sessionData.ip_address || null,
      sessionData.user_agent || null,
      true
    ).run();
    
    return sessionId;
  }

  async getSessionByToken(tokenHash: string) {
    const stmt = this.db.prepare(`
      SELECT s.id, s.user_id, s.is_active, s.expires_at, s.last_activity_at,
             u.email, u.role, u.account_status, u.organization_id
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token_hash = ? AND s.is_active = true AND s.expires_at > CURRENT_TIMESTAMP
    `);
    
    const result = await stmt.bind(tokenHash).first();
    return result || null;
  }

  async deleteSession(tokenHash: string): Promise<void> {
    const stmt = this.db.prepare(`
      UPDATE sessions 
      SET is_active = false
      WHERE token_hash = ?
    `);
    
    await stmt.bind(tokenHash).run();
  }

  // Conversation operations
  async createConversation(conversationData: {
    user_id: string;
    title: string;
    model?: string;
    conversation_type?: string;
    organization_id?: string;
  }) {
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    const stmt = this.db.prepare(`
      INSERT INTO conversations (id, user_id, organization_id, title, model, conversation_type)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    await stmt.bind(
      conversationId,
      conversationData.user_id,
      conversationData.organization_id || null,
      conversationData.title,
      conversationData.model || 'llama-3.2-1b-preview',
      conversationData.conversation_type || 'chat'
    ).run();
    
    return conversationId;
  }

  async getConversationsByUser(userId: string, limit = 50, offset = 0) {
    const stmt = this.db.prepare(`
      SELECT id, title, model, conversation_type, is_pinned, is_archived,
             last_message_at, message_count, token_usage, created_at, updated_at
      FROM conversations 
      WHERE user_id = ? AND deleted_at IS NULL
      ORDER BY updated_at DESC
      LIMIT ? OFFSET ?
    `);
    
    const result = await stmt.bind(userId, limit, offset).all();
    return result.results || [];
  }

  // Message operations
  async createMessage(messageData: {
    conversation_id: string;
    user_id?: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    model_used?: string;
    tokens_used?: number;
  }) {
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    const stmt = this.db.prepare(`
      INSERT INTO messages (id, conversation_id, user_id, role, content, model_used, tokens_used)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    await stmt.bind(
      messageId,
      messageData.conversation_id,
      messageData.user_id || null,
      messageData.role,
      messageData.content,
      messageData.model_used || null,
      messageData.tokens_used || 0
    ).run();
    
    // Update conversation stats
    const updateStmt = this.db.prepare(`
      UPDATE conversations 
      SET message_count = message_count + 1, 
          last_message_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    await updateStmt.bind(messageData.conversation_id).run();
    
    return messageId;
  }

  async getMessagesByConversation(conversationId: string, limit = 100, offset = 0) {
    const stmt = this.db.prepare(`
      SELECT id, user_id, role, content, model_used, tokens_used,
             feedback_rating, created_at
      FROM messages 
      WHERE conversation_id = ? AND deleted_at IS NULL
      ORDER BY created_at ASC
      LIMIT ? OFFSET ?
    `);
    
    const result = await stmt.bind(conversationId, limit, offset).all();
    return result.results || [];
  }

  // OAuth providers
  async createOAuthProvider(providerData: {
    user_id: string;
    provider: string;
    provider_user_id: string;
    provider_username?: string;
    provider_email?: string;
    access_token?: string;
    refresh_token?: string;
    token_expires_at?: string;
    scope?: string;
  }): Promise<string> {
    const providerId = `oauth_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    const stmt = this.db.prepare(`
      INSERT INTO oauth_providers (id, user_id, provider, provider_user_id, provider_username,
                                  provider_email, access_token, refresh_token, token_expires_at, scope)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    await stmt.bind(
      providerId,
      providerData.user_id,
      providerData.provider,
      providerData.provider_user_id,
      providerData.provider_username || null,
      providerData.provider_email || null,
      providerData.access_token || null,
      providerData.refresh_token || null,
      providerData.token_expires_at || null,
      providerData.scope || null
    ).run();
    
    return providerId;
  }

  async getOAuthProvider(provider: string, providerUserId: string) {
    const stmt = this.db.prepare(`
      SELECT op.*, u.email, u.account_status
      FROM oauth_providers op
      JOIN users u ON op.user_id = u.id
      WHERE op.provider = ? AND op.provider_user_id = ?
    `);
    
    const result = await stmt.bind(provider, providerUserId).first();
    return result || null;
  }

  // Cross-domain temporary tokens (using in-memory for demo)
  private tempTokens = new Map();

  async storeTempToken(token: string, data: any, expiresAt: Date): Promise<void> {
    this.tempTokens.set(token, {
      ...data,
      expires_at: expiresAt.toISOString()
    });
    
    // Clean up expired tokens
    setTimeout(() => {
      this.tempTokens.delete(token);
    }, 5 * 60 * 1000); // 5 minutes
  }

  async getTempTokenData(token: string) {
    const data = this.tempTokens.get(token);
    if (!data) return null;
    
    // Check if expired
    if (new Date(data.expires_at) < new Date()) {
      this.tempTokens.delete(token);
      return null;
    }
    
    return data;
  }

  async deleteTempToken(token: string): Promise<void> {
    this.tempTokens.delete(token);
  }

  // Health check
  async isHealthy(): Promise<boolean> {
    try {
      const result = await this.db.prepare('SELECT 1 as test').first();
      return !!result;
    } catch {
      return false;
    }
  }
}