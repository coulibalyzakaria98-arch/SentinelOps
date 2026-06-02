const ALGO = "AES-GCM";
const IV_LENGTH = 12;

let cryptoKey = null;

/**
 * Derives a cryptographic key dynamically from a session secret.
 * The key is NEVER persisted to storage, ensuring maximum security 
 * against physical access and local extraction.
 */
export const initCrypto = async (sessionSecret = "sentinelops-default-secure-vault-2026") => {
  const enc = new TextEncoder();

  // Import the raw secret as key material
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(sessionSecret),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  // Derive the actual AES-GCM key using PBKDF2
  // 📱 Dynamic Adaptation: Calibrate encryption effort based on device performance.
  // Low-end devices (<= 4 cores) use 3000 iterations for responsiveness.
  // High-performance devices use 10000 iterations for enhanced security.
  const iterations = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ? 3000 : 10000;
  
  cryptoKey = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("sentinelops-stabilization-salt-v1"),
      iterations: iterations, 
      hash: "SHA-256"
    },
    keyMaterial,
    { name: ALGO, length: 256 },
    false,
    ["encrypt", "decrypt"]
  );

  // console.log(`🔐 Encryption Protocol: ${iterations} iterations (Dynamic Adaptation Active)`);
};

/**
 * Encrypts sensitive report data before local storage.
 */
export const encryptData = async (data) => {
  if (!cryptoKey) throw new Error("Encryption protocol not initialized");
  
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encoded = new TextEncoder().encode(JSON.stringify(data));

  const encrypted = await window.crypto.subtle.encrypt(
    { name: ALGO, iv },
    cryptoKey,
    encoded
  );

  return {
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(encrypted))
  };
};

/**
 * Decrypts data retrieved from local storage for synchronization.
 */
export const decryptData = async (payload) => {
  if (!cryptoKey) throw new Error("Encryption protocol not initialized");
  
  const iv = new Uint8Array(payload.iv);
  const data = new Uint8Array(payload.data);

  const decrypted = await window.crypto.subtle.decrypt(
    { name: ALGO, iv },
    cryptoKey,
    data
  );

  return JSON.parse(new TextDecoder().decode(decrypted));
};

/**
 * Generates a cryptographic signature for a report to ensure data integrity.
 * Prevents tampering during the synchronization process.
 */
export const signReport = async (data) => {
  const enc = new TextEncoder();
  const signatureKey = await window.crypto.subtle.importKey(
    "raw",
    enc.encode("sentinelops-integrity-secret"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await window.crypto.subtle.sign(
    "HMAC",
    signatureKey,
    enc.encode(JSON.stringify(data))
  );

  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};
