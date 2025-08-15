import bcrypt from 'bcryptjs';

export class CryptoService {
  /**
   * Hash password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12; // Increased for better security
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Verify password against hash
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Generate secure random password
   */
  static generateSecurePassword(length: number = 16): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    
    return password;
  }

  /**
   * Generate secure API key
   */
  static generateApiKey(): string {
    const prefix = 'axl_';
    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    const key = Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
    return prefix + key;
  }

  /**
   * Create SHA-256 hash
   */
  static async sha256(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generate HMAC signature
   */
  static async generateHMAC(data: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyBuffer = encoder.encode(secret);
    const dataBuffer = encoder.encode(data);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, dataBuffer);
    const signatureArray = Array.from(new Uint8Array(signature));
    return signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Verify HMAC signature
   */
  static async verifyHMAC(data: string, signature: string, secret: string): Promise<boolean> {
    const expectedSignature = await this.generateHMAC(data, secret);
    return expectedSignature === signature;
  }

  /**
   * Generate secure random string
   */
  static generateRandomString(length: number = 32): string {
    const randomBytes = crypto.getRandomValues(new Uint8Array(length));
    return Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Validate password strength
   */
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    requirements: {
      length: boolean;
      lowercase: boolean;
      uppercase: boolean;
      numbers: boolean;
      symbols: boolean;
    };
  } {
    const requirements = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    const score = Object.values(requirements).filter(Boolean).length;
    const isValid = score >= 4 && requirements.length;

    return {
      isValid,
      score,
      requirements,
    };
  }
}