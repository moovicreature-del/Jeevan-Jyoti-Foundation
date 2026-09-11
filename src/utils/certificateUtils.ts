/**
 * Jeevan Jyoti Foundation - Certificate & Receipt Number Generation Utility
 * Generates official registration, certificate, ID card and 80G numbers based on
 * issued number, month and year (Issued Number / Month / Year)
 * 
 * Standard Format: JJF/<TYPE>/<YEAR>/<MONTH>/<ISSUED_NUMBER>
 * Serial numbers strictly start from 01 (e.g. 01, 02, 03, ...)
 * Examples:
 *  - Volunteer Certificate: JJF/VOL/2026/08/01
 *  - Swayam Sewak ID: JJF/ID/2026/08/01
 *  - 80G Donation Receipt: JJF/80G/2026/08/01
 *  - Task Appreciation Award: JJF/APP/2026/08/01
 *  - Festival Wishing Certificate: JJF/FEST/2026/08/01
 */

export type CertificateTypePrefix = 'VOL' | 'ID' | '80G' | 'APP' | 'FEST' | 'DON' | 'REP';

const inMemoryCounters: Record<string, number> = {};

/**
 * Get next sequential issue serial number starting from 01
 */
export function getNextCertificateSeq(type: string = 'GEN'): string {
  try {
    const key = `jjf_cert_seq_${type.toLowerCase()}`;
    const current = parseInt(localStorage.getItem(key) || '0', 10);
    const next = current + 1;
    localStorage.setItem(key, String(next));
    return String(next).padStart(2, '0');
  } catch {
    inMemoryCounters[type] = (inMemoryCounters[type] || 0) + 1;
    return String(inMemoryCounters[type]).padStart(2, '0');
  }
}

/**
 * Format official Certificate Number with Issued Number / Month / Year
 * Sequence numbers strictly start from 01 (01, 02, 03...)
 */
export function formatCertificateNumber(
  type: CertificateTypePrefix | string,
  dateInput?: string | Date | null,
  rawIdOrNumber?: string | number | null
): string {
  const d = dateInput ? new Date(dateInput) : new Date();
  const validDate = !isNaN(d.getTime()) ? d : new Date();
  const year = validDate.getFullYear();
  const month = String(validDate.getMonth() + 1).padStart(2, '0');

  let issuedSeq = '01';
  if (rawIdOrNumber !== undefined && rawIdOrNumber !== null) {
    const rawStr = String(rawIdOrNumber).trim();
    const digits = rawStr.replace(/[^0-9]/g, '');
    if (digits.length > 0) {
      const num = parseInt(digits, 10);
      issuedSeq = !isNaN(num) && num > 0 ? String(num).padStart(2, '0') : '01';
    }
  } else {
    issuedSeq = getNextCertificateSeq(type);
  }

  return `JJF/${type}/${year}/${month}/${issuedSeq}`;
}

/**
 * Format official issue date (e.g. 22 Aug 2026)
 */
export function formatCertificateIssueDate(dateInput?: string | Date | null): string {
  const d = dateInput ? new Date(dateInput) : new Date();
  const validDate = !isNaN(d.getTime()) ? d : new Date();
  return validDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Format official service duration string based purely on calendar dates / service period (No hours)
 * Example: 'From 01 Jan 2026 to 25 Aug 2026' or '01 Jan 2026 से 25 Aug 2026 तक'
 */
export function formatCertificateDuration(
  fromDateInput?: string | Date | null,
  toDateInput?: string | Date | null,
  language: 'hi' | 'en' | 'bilingual' = 'bilingual'
): string {
  const fromD = fromDateInput ? new Date(fromDateInput) : new Date();
  const validFrom = !isNaN(fromD.getTime()) ? fromD : new Date();
  const toD = toDateInput ? new Date(toDateInput) : new Date();
  const validTo = !isNaN(toD.getTime()) ? toD : new Date();

  const fromStr = validFrom.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const toStr = validTo.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  if (language === 'hi') {
    return `${fromStr} से ${toStr} तक`;
  }
  return `From ${fromStr} to ${toStr}`;
}
