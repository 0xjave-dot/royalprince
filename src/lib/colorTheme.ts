export interface DailyTheme {
  accent: string;
  accentLight: string;
  accentLighter: string;
  shellBackground: string;
}

function normalizeHex(hex: string): string {
  const value = hex.trim().replace(/^#/, "").toLowerCase();
  if (value.length === 3) {
    return value
      .split("")
      .map((char) => char + char)
      .join("");
  }
  return value;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = normalizeHex(hex);
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return { r, g, b };
}

export function mixHex(hexA: string, hexB: string, amount: number): string {
  const clamped = Math.max(0, Math.min(1, amount));
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);

  const r = Math.round(a.r * clamped + b.r * (1 - clamped));
  const g = Math.round(a.g * clamped + b.g * (1 - clamped));
  const bValue = Math.round(a.b * clamped + b.b * (1 - clamped));

  return `#${[r, g, bValue].map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

export function rgbaFromHex(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getReadableTextClass(
  backgroundHex: string,
  options: { lightClass?: string; darkClass?: string; threshold?: number } = {},
): string {
  const { lightClass = "text-white", darkClass = "text-dark", threshold = 140 } = options;
  const { r, g, b } = hexToRgb(backgroundHex);
  const luminance = (r * 299 + g * 587 + b * 114) / 1000;
  return luminance >= threshold ? darkClass : lightClass;
}

export function buildDailyTheme(accentHex: string): DailyTheme {
  const accent = `#${normalizeHex(accentHex)}`;
  const accentLight = mixHex(accent, "#ffffff", 0.86);
  const accentLighter = mixHex(accent, "#ffffff", 0.94);
  const shellBackground = `radial-gradient(circle_at_top, ${accentLighter} 0%, ${mixHex(accent, "#ffffff", 0.975)} 32%, #f3f6fb 60%, #eef2f7 100%)`;

  return {
    accent,
    accentLight,
    accentLighter,
    shellBackground,
  };
}
