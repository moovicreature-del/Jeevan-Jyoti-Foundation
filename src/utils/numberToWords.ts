/**
 * Indian Currency Number to Words Converter
 * Converts numeric amounts (e.g. 2100) into standard Indian Rupees word representation
 * Example: 2100 -> "Rupees Two Thousand One Hundred Only"
 */

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const TENS = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertLessThanOneThousand(num: number): string {
  let current = '';

  if (num % 100 < 20) {
    current = ONES[num % 100];
    num = Math.floor(num / 100);
  } else {
    current = ONES[num % 10];
    num = Math.floor(num / 10);

    current = TENS[num % 10] + (current ? ' ' + current : '');
    num = Math.floor(num / 10);
  }

  if (num === 0) return current;
  return ONES[num] + ' Hundred' + (current ? ' and ' + current : '');
}

export function amountToWordsIndian(amount: number): string {
  if (!amount || isNaN(amount) || amount === 0) {
    return 'Rupees Zero Only';
  }

  const num = Math.floor(Math.abs(amount));
  let result = '';

  const crore = Math.floor(num / 10000000);
  let remainder = num % 10000000;

  const lakh = Math.floor(remainder / 100000);
  remainder = remainder % 100000;

  const thousand = Math.floor(remainder / 1000);
  remainder = remainder % 1000;

  const hundred = remainder;

  if (crore > 0) {
    result += convertLessThanOneThousand(crore) + ' Crore ';
  }

  if (lakh > 0) {
    result += convertLessThanOneThousand(lakh) + ' Lakh ';
  }

  if (thousand > 0) {
    result += convertLessThanOneThousand(thousand) + ' Thousand ';
  }

  if (hundred > 0) {
    result += convertLessThanOneThousand(hundred);
  }

  return `Rupees ${result.trim()} Only`;
}

export function amountToWordsHindi(amount: number): string {
  if (!amount || isNaN(amount) || amount === 0) {
    return 'शून्य रुपये मात्र';
  }
  // Standard formatted representation
  return `${amount.toLocaleString('en-IN')} रुपये मात्र`;
}
