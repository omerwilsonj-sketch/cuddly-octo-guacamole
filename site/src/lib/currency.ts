// Currency conversion utilities for FluentPath Spanish pricing.
//
// Base prices are stored in GBP. Live rates come from the free, keyless
// open.er-api.com endpoint (https://www.exchangerate-api.com/docs/free),
// cached in localStorage for 12h, with static approximate fallbacks.

export const BASE_CURRENCY = "GBP";
export const STORAGE_KEY = "fluentpath_currency";
const RATES_CACHE_KEY = "fluentpath_rates_v1";
const CACHE_TTL_MS = 12 * 60 * 60 * 1000;
const RATES_URL = "https://open.er-api.com/v6/latest/GBP";

export interface CurrencyInfo {
  code: string;
  label: string;
}

export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  { code: "GBP", label: "British Pound" },
  { code: "USD", label: "US Dollar" },
  { code: "EUR", label: "Euro" },
  { code: "MXN", label: "Mexican Peso" },
  { code: "ARS", label: "Argentine Peso" },
  { code: "COP", label: "Colombian Peso" },
  { code: "CLP", label: "Chilean Peso" },
  { code: "BRL", label: "Brazilian Real" },
  { code: "PEN", label: "Peruvian Sol" },
  { code: "UYU", label: "Uruguayan Peso" },
  { code: "CAD", label: "Canadian Dollar" },
  { code: "AUD", label: "Australian Dollar" },
  { code: "NZD", label: "New Zealand Dollar" },
  { code: "CHF", label: "Swiss Franc" },
];

const SUPPORTED_CODES = new Set(SUPPORTED_CURRENCIES.map((c) => c.code));

// Approximate static fallback rates (1 GBP = X). Only used when the live
// API is unreachable and there is no cached response.
const FALLBACK_RATES: Record<string, number> = {
  GBP: 1,
  USD: 1.27,
  EUR: 1.17,
  MXN: 23.5,
  ARS: 1900,
  COP: 5200,
  CLP: 1200,
  BRL: 6.9,
  PEN: 4.5,
  UYU: 51,
  CAD: 1.74,
  AUD: 1.93,
  NZD: 2.08,
  CHF: 1.12,
};

// Browser region -> local currency mapping for auto-detection.
const REGION_TO_CURRENCY: Record<string, string> = {
  GB: "GBP",
  US: "USD",
  ES: "EUR",
  DE: "EUR",
  FR: "EUR",
  IT: "EUR",
  IE: "EUR",
  PT: "EUR",
  NL: "EUR",
  BE: "EUR",
  AT: "EUR",
  FI: "EUR",
  GR: "EUR",
  MX: "MXN",
  AR: "ARS",
  CO: "COP",
  CL: "CLP",
  BR: "BRL",
  PE: "PEN",
  UY: "UYU",
  EC: "USD",
  PA: "USD",
  CA: "CAD",
  AU: "AUD",
  NZ: "NZD",
  CH: "CHF",
};

function regionFromLocale(locale: string): string | null {
  try {
    const maximized = new Intl.Locale(locale).maximize();
    return maximized.region ?? null;
  } catch {
    const parts = locale.split(/[-_]/);
    const region = parts[1]?.toUpperCase() ?? null;
    return region && /^[A-Z]{2}$/.test(region) ? region : null;
  }
}

/** Guess the visitor's currency from their browser locale. Falls back to GBP. */
export function detectCurrency(locale: string): string {
  const region = regionFromLocale(locale);
  if (region) {
    const code = REGION_TO_CURRENCY[region];
    if (code && SUPPORTED_CODES.has(code)) return code;
  }
  return BASE_CURRENCY;
}

/** Read a previously saved currency choice, or null if none/invalid. */
export function loadSavedCurrency(): string | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved && SUPPORTED_CODES.has(saved) ? saved : null;
  } catch {
    return null;
  }
}

export function saveCurrency(code: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    // Private browsing etc. — conversion still works for this visit.
  }
}

export interface RatesResult {
  rates: Record<string, number>;
  /** True when rates came from the live API (fresh or cached). */
  live: boolean;
  /** ISO timestamp of the rates, when known. */
  updatedAt: string | null;
}

interface CachedRates {
  rates: Record<string, number>;
  updatedAt: string;
  fetchedAt: number;
}

function readCache(): CachedRates | null {
  try {
    const raw = localStorage.getItem(RATES_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedRates;
    if (!parsed.rates || typeof parsed.fetchedAt !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(rates: Record<string, number>, updatedAt: string): void {
  try {
    const payload: CachedRates = { rates, updatedAt, fetchedAt: Date.now() };
    localStorage.setItem(RATES_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Cache is a nice-to-have; ignore quota errors.
  }
}

/**
 * Fetch live GBP-based rates. Returns cached or static fallback rates when
 * offline so prices always render.
 */
export async function getRates(): Promise<RatesResult> {
  const cached = readCache();
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return { rates: cached.rates, live: true, updatedAt: cached.updatedAt };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(RATES_URL, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`rates HTTP ${res.status}`);
    const data = (await res.json()) as {
      result?: string;
      rates?: Record<string, number>;
      time_last_update_utc?: string;
    };
    if (data.result !== "success" || !data.rates) throw new Error("bad rates payload");
    const updatedAt = data.time_last_update_utc ?? new Date().toUTCString();
    writeCache(data.rates, updatedAt);
    return { rates: data.rates, live: true, updatedAt };
  } catch {
    if (cached) {
      return { rates: cached.rates, live: false, updatedAt: cached.updatedAt };
    }
    return { rates: FALLBACK_RATES, live: false, updatedAt: null };
  }
}

/** Convert a GBP base price and format it for the target currency. Whole units keep prices clean. */
export function formatPrice(
  gbpAmount: number,
  currencyCode: string,
  rates: Record<string, number>,
  locale: string,
): string {
  const rate = rates[currencyCode] ?? 1;
  const converted = Math.round(gbpAmount * rate);
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(converted);
  } catch {
    return `${currencyCode} ${converted.toLocaleString("en-US")}`;
  }
}
