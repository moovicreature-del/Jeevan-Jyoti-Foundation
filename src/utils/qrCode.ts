export interface QrOptions {
  size?: number;
  includeLogo?: boolean;
  level?: 'L' | 'M' | 'Q' | 'H';
}

export const BASE_VERIFY_URL = 'https://jeevanjyotifoundation.org/verify?cert_id=';

export function getVerificationUrl(certId: string): string {
  const cleanId = certId.trim();
  return `${BASE_VERIFY_URL}${encodeURIComponent(cleanId)}`;
}

export function formatCertificateId(type: 'VOL' | 'DON' | 'TSK' | 'CRD' | 'REP', index: number = 1): string {
  const currentYear = new Date().getFullYear();
  return `JJF-${type}-${currentYear}-${index.toString().padStart(2, '0')}`;
}
