import crypto from 'crypto';
import { config } from 'dotenv';
config();

if (!process.env.ENCRYPTION_KEY || !process.env.ENCRYPTION_IV) {
  throw new Error('ENCRYPTION_KEY aur ENCRYPTION_IV environment variables zaroori hain');
}

const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');

class CryptoService {
  private algorithm = 'aes-256-cbc';

  encryptData(data: string): string {
    try {
      const cipher = crypto.createCipheriv(this.algorithm, key, iv);
      let encrypted = cipher.update(data, 'utf-8', 'hex');
      encrypted += cipher.final('hex');

      return encrypted;
    } catch (error: any) {
      throw new Error(`Encryption failed: ${error.message}`);
    }
  }

  decryptData(data: string): string {
    try {
      const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
      let decrypted = decipher.update(data, 'hex', 'utf-8');
      decrypted += decipher.final('utf-8');

      return decrypted;
    } catch (error: any) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }
}

export const cryptoService = new CryptoService();