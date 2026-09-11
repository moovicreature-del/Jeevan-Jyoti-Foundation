export function calculateTotalHours(hoursArray: number[]): number {
  return hoursArray.reduce((acc, curr) => acc + (Number(curr) || 0), 0);
}

export function formatIndianDate(dateInput: string | Date = new Date()): string {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export function calculateMembershipAge(joinDate: string): { years: number; months: number } {
  const start = new Date(joinDate);
  const now = new Date();
  if (isNaN(start.getTime())) return { years: 0, months: 0 };
  
  let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  if (months < 0) months = 0;
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  return { years, months: remainingMonths };
}
