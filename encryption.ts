import * as crypto from "crypto";

const algorithm: string = "aes-256-cbc";
const salt: string = "salt";

export function encryptPassword(password: string): string {
  const key: Buffer = crypto.scryptSync(password, salt, 32);
  const iv: Buffer = Buffer.alloc(16, 0);
  const cipher: crypto.Cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted: string = cipher.update(password, "utf8", "hex");
  encrypted += cipher.final("hex");

  return encrypted;
}
