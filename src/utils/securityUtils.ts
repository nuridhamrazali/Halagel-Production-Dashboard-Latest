/**
 * HALAGEL SECURITY UTILITIES
 * Implements Hashing and Sanitization for Pentest Compliance.
 */

export async function hashPassword(password: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const msgUint8 = new TextEncoder().encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      console.warn("Hashing failed, falling back to basic encoding", e);
    }
  }
  return "plain_" + btoa(password).substring(0, 59);
}

export const sanitizeInput = (input: any): string => {
  if (input === null || input === undefined) return '';
  const strValue = String(input);
  if (!strValue) return '';
  return strValue
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
};

export const deepFreeze = (obj: any) => {
  Object.getOwnPropertyNames(obj).forEach(name => {
    const prop = obj[name];
    if (prop !== null && typeof prop === 'object') deepFreeze(prop);
  });
  return Object.freeze(obj);
};
