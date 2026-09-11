export interface VerificationTokenPayload {
  certId: string;
  recipientName: string;
  type: string;
  issuedAt: number;
  hash: string;
}

export function generateVerificationHash(certId: string, name: string): string {
  const raw = `${certId}:${name}:JJF_GHAZIPUR_2018`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).toUpperCase();
}

export function createVerificationToken(certId: string, recipientName: string, type: string = 'VOLUNTEER'): string {
  const payload: VerificationTokenPayload = {
    certId,
    recipientName,
    type,
    issuedAt: Date.now(),
    hash: generateVerificationHash(certId, recipientName)
  };
  return btoa(JSON.stringify(payload));
}

export function decodeVerificationToken(token: string): VerificationTokenPayload | null {
  try {
    const json = atob(token);
    return JSON.parse(json) as VerificationTokenPayload;
  } catch {
    return null;
  }
}
