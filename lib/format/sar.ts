/** Map Arabic / Persian digit code points to ASCII 0–9 (for locale-formatted currency strings). */
function normalizeDigitsToAscii(input: string): string {
  let out = "";
  for (const ch of input) {
    const cp = ch.codePointAt(0)!;
    if (cp >= 0x0660 && cp <= 0x0669) out += String.fromCharCode(0x30 + (cp - 0x0660));
    else if (cp >= 0x06f0 && cp <= 0x06f9) out += String.fromCharCode(0x30 + (cp - 0x06f0));
    else out += ch;
  }
  return out;
}

/** Parse "SAR 12,345" / "12,345" style strings to a number for reconciliation. */
export function parseSarToNumber(value: string | number): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const normalized = normalizeDigitsToAscii(String(value));
  const m = normalized.match(/([\d,]+)/);
  if (!m) return 0;
  return parseInt(m[1].replace(/,/g, ""), 10) || 0;
}
