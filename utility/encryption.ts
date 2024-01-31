import * as crypto from "crypto";
import dotenv from 'dotenv';

dotenv.config();

const algorithm: string = process.env.ENCRYPTION_ALGORITHM ||"";
const salt: string = process.env.SALT || "";
export function encryptPassword(password: string): string {
  const key: Buffer = crypto.scryptSync(password, salt, 32);
  const iv: Buffer = Buffer.alloc(16, 0);
  const cipher: crypto.Cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted: string = cipher.update(password, "utf8", "hex");
  encrypted += cipher.final("hex");

  return encrypted;
}
