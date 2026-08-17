/** Normalizes Pakistani mobile numbers to +92XXXXXXXXXX. Returns null if invalid. */
export function normalizePakistaniPhone(raw: string): string | null {
  const digits = raw.replace(/[^\d]/g, "");

  let national: string | null = null;
  if (digits.startsWith("92") && digits.length === 12) {
    national = digits.slice(2);
  } else if (digits.startsWith("0") && digits.length === 11) {
    national = digits.slice(1);
  } else if (digits.length === 10) {
    national = digits;
  }

  if (!national || !/^3\d{9}$/.test(national)) return null;
  return `+92${national}`;
}
