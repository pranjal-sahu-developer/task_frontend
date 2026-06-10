import CryptoJS from 'crypto-js';

class CryptoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CryptoError';
  }
}

const getSecretKey = (): string => {
  const secretKey = import.meta.env.VITE_SECRET_KEY;

  if (!secretKey || secretKey.trim() === '') {
    throw new CryptoError(
      'VITE_SECRET_KEY is not defined in environment variables',
    );
  }

  return secretKey;
};

export const encryptData = (data: string): string => {
  try {
    if (typeof data !== 'string' || data.trim() === '') {
      throw new CryptoError('Data to encrypt must be a non-empty string');
    }

    const secretKey = getSecretKey();
    const encrypted = CryptoJS.AES.encrypt(data, secretKey).toString();

    if (!encrypted) {
      throw new CryptoError('Encryption failed to produce ciphertext');
    }

    return encrypted;
  } catch (error) {
    if (error instanceof CryptoError) {
      throw error;
    }

    throw new CryptoError(
      `Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

export const decryptData = (data: string): string => {
  try {
    if (typeof data !== 'string' || data.trim() === '') {
      throw new CryptoError('Data to decrypt must be a non-empty string');
    }

    const secretKey = getSecretKey();
    const decrypted = CryptoJS.AES.decrypt(data, secretKey).toString(
      CryptoJS.enc.Utf8,
    );

    if (!decrypted) {
      throw new CryptoError(
        'Decryption failed. The data may be invalid or the secret key is incorrect',
      );
    }

    return decrypted;
  } catch (error) {
    if (error instanceof CryptoError) {
      throw error;
    }

    throw new CryptoError(
      `Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};
