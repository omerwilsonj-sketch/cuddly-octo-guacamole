import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  BASE_CURRENCY,
  SUPPORTED_CURRENCIES,
  formatPrice,
  getRates,
  loadSavedCurrency,
  saveCurrency,
} from "~/lib/currency";
import { STRIPE_LINKS } from "~/lib/paymentLinks";
import { seoHead } from "~/lib/seo";
import { VerifiedReviews } from "~/components/VerifiedReviews";
import { EmailCapture } from "~/components/EmailCapture";

export const Route = createFileRoute("/")({
  head: () =>
    seoHead({
      title: "FluentPath Spanish — Dialect Coaching with Native Teachers",
      description:
        "Live Spanish tutoring for intermediate and advanced learners: dialect-specific coaching from native teachers — Castilian, Mexican, Argentinian, Chilean and more. Start with a free session.",
      path: "/",
    }),
  component: Home,
});

/* ── Icons ── */
function IconGraduation() {
  return (
    <svg className="h-5 w-5 text-[var(--accent)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479L12 21l-6.825-3.943a12.083 12.083 0 01.665-6.479L12 14z" />
    </svg>
  );
}

function IconMap() {
  return (
    <svg className="h-5 w-5 text-[var(--accent)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  );
}

function IconX() {
  return (
    <svg className="h-5 w-5 text-[var(--accent)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg className="h-5 w-5 text-[var(--accent)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

/* ── Pricing plans (GBP base — display-only conversion, Stripe stays GBP) ── */
interface PricePoint {
  key: string;
  gbp: number;
  suffix: string;
}

const PRICE_POINTS: PricePoint[] = [
  { key: "group", gbp: 25, suffix: "/ session" },
  { key: "coaching", gbp: 50, suffix: "/ hour" },
  { key: "subscription", gbp: 19, suffix: "/ month" },
  { key: "pack5", gbp: 225, suffix: "· 5 sessions" },
  { key: "pack10", gbp: 400, suffix: "· 10 sessions" },
  { key: "annual", gbp: 179, suffix: "/ year" },
];

/** Formats a GBP base amount into whatever currency the visitor has selected. */
type PriceFormatter = (gbp: number) => string;

const PRICE_POINTS_BY_KEY = new Map(PRICE_POINTS.map((point) => [point.key, point]));

interface Plan {
  name: string;
  tagline: string;
  features: string[];
  cta: string;
  popular?: boolean;
  priceKey: string;
  /**
   * Note shown under the headline price. It receives the currency formatter so
   * amounts inside the note (ranges, annual price) convert along with
   * everything else — no hardcoded £ amounts anywhere in the pricing section.
   */
  priceNote: (fmt: PriceFormatter) => string;
  link: string;
}

const PLANS: Plan[] = [
  {
    name: "Group Classes",
    tagline: "Themed conversation sessions",
    priceKey: "group",
    priceNote: (fmt) => `${fmt(20)}–${fmt(35)} range · pay per session`,
    features: [
      "Small groups (max 4–6 students)",
      "\u201CWork Spanish\u201D themes",
      "\u201CDating & Relationships\u201D themes",
      "Peer learning environment",
    ],
    cta: "Book a group seat",
    link: STRIPE_LINKS.groupClass,
  },
  {
    name: "1-on-1 Coaching",
    tagline: "Personalized fluency training",
    priceKey: "coaching",
    priceNote: (fmt) => `${fmt(40)}–${fmt(80)} range · session packs save more`,
    features: [
      "100% customized curriculum",
      "Flexible scheduling",
      "Industry-specific vocabulary",
      "Discounted 5 & 10 session packs",
    ],
    cta: "Book 1-on-1",
    popular: true,
    link: STRIPE_LINKS.oneOnOne,
  },
  {
    name: "Subscription",
    tagline: "For committed learners · 7-day free trial",
    priceKey: "subscription",
    priceNote: (fmt) => `Or ${fmt(179)}/year — two months free`,
    features: [
      "Unlimited teacher access",
      "Weekly group sessions",
      "Premium lesson materials",
      "24/7 text support",
    ],
    cta: "Start 7-Day Free Trial",
    link: STRIPE_LINKS.monthly,
  },
];

const PACKS = [
  { key: "pack5", label: "5-session pack", link: STRIPE_LINKS.pack5 },
  { key: "pack10", label: "10-session pack", link: STRIPE_LINKS.pack10 },
  { key: "annual", label: "Annual subscription", link: STRIPE_LINKS.annual },
];

/* ── Pricing section with real-time local currency conversion ── */
interface PricingSectionProps {
  fmt: PriceFormatter;
  currency: string;
  rates: Record<string, number>;
  live: boolean;
  loading: boolean;
  updatedAt: string | null;
  locale: string;
  setCurrency: (code: string) => void;
}

function PricingSection({
  fmt,
  currency,
  rates,
  live,
  loading,
  updatedAt,
  locale,
  setCurrency,
}: PricingSectionProps) {
  const handleChange = (code: string) => {
    setCurrency(code);
    saveCurrency(code);
  };

  const price = (key: string): { amount: string; suffix: string } => {
    const point = PRICE_POINTS_BY_KEY.get(key);
    if (!point) return { amount: "—", suffix: "" };
    return { amount: fmt(point.gbp), suffix: point.suffix };
  };

  return (
    <section id="pricing" className="scroll-mt-20 border-t border-[var(--border-subtle)] py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-10 text-center">
          <h2 className="font-['Montserrat'] text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
            Investment in Your Fluency
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-[var(--text-secondary)] sm:text-lg">
            Choose the path that fits your goals, schedule, and budget.
          </p>
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-layer-1)] px-3 py-2">
            <label htmlFor="currency-select" className="ml-1 text-sm font-semibold text-[var(--text-secondary)]">
              Currency:
            </label>
            <select
              id="currency-select"
              value={currency}
              onChange={(e) => handleChange(e.target.value)}
              className="cursor-pointer rounded-md border border-[var(--border-strong)] bg-[var(--bg-layer-2)] p-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
            >
              {SUPPORTED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.label}
                  {c.code === BASE_CURRENCY ? " (billing currency)" : ""}
                </option>
              ))}
            </select>
            <span className="mr-1 text-xs text-[var(--text-tertiary)]" aria-live="polite">
              {loading ? "Fetching live rates…" : live ? "Live rates ●" : "Offline rates ○"}
            </span>
          </div>
          <p className="mt-2 text-xs text-[var(--text-tertiary)]">
            Always charged in GBP — the currency we bill in. Selecting USD or EUR shows an
            approximate conversion at live rates
            {updatedAt ? ` (updated ${new Date(updatedAt).toLocaleDateString(locale)})` : ""}; the
            exact amount is confirmed at checkout.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => {
            const p = price(plan.priceKey);
            return (
              <div key={plan.name} className={`card flex flex-col ${plan.popular ? "relative border-[var(--accent)] md:-translate-y-2" : ""}`}>
                {plan.popular && (
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-[var(--accent)] to-[var(--accent-hover)] px-4 py-1 text-xs font-bold uppercase tracking-wide text-[var(--on-accent)]">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-[var(--text-primary)]">{plan.name}</h3>
                <p className="mt-1 text-base text-[var(--text-tertiary)]">{plan.tagline}</p>
                <div className="mb-1 mt-5">
                  <span className="text-4xl font-bold text-[var(--text-primary)]">{p.amount}</span>{" "}
                  <span className="text-sm text-[var(--text-secondary)]">{p.suffix}</span>
                </div>
                <p className="mb-6 text-sm text-[var(--text-tertiary)]">{plan.priceNote(fmt)}</p>
                <ul className="mb-8 space-y-3 text-base text-[var(--text-secondary)]">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="text-[var(--accent)]">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href={plan.link} target="_blank" rel="noopener noreferrer" className={`${plan.popular ? "btn-primary" : "btn-secondary"} mt-auto w-full`}>
                  {plan.cta}
                </a>
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {PACKS.map((item) => {
            const p = price(item.key);
            return (
              <div key={item.key} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-layer-1)] px-5 py-4 text-center">
                <div className="mb-3">
                  <p className="text-sm font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">{item.label}</p>
                  <p className="mt-1 text-2xl font-bold text-[var(--accent)]">{p.amount}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">{p.suffix}</p>
                </div>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary block w-full text-center"
                >
                  Buy Pack
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Star rating (read-only) ── */
function Stars({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i <= rating ? "text-[var(--accent)]" : "text-[var(--border-strong)]"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/* ── Trust signal pill ── */
function TrustPill({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-layer-1)] px-4 py-2 text-sm text-[var(--text-secondary)]">
      <div className="flex-shrink-0">{icon}</div>
      <span className="leading-tight">{label}</span>
    </div>
  );
}

/* The reviews section (empty state, verified cards, verification rules) now
   lives in src/components/VerifiedReviews.tsx and reads src/lib/reviews.ts —
   publishing a review is an edit to that data file, nothing else. */

/* ── Review card (filled – ready for real reviews; exported so the
   designer's upcoming testimonials work can import it) ── */
export function ReviewCard({
  name,
  location,
  rating,
  text,
}: {
  name: string;
  location: string;
  rating: number;
  text: string;
}) {
  return (
    <div className="card flex flex-col gap-4">
      <Stars rating={rating} />
      <p className="text-sm leading-relaxed text-[var(--text-secondary)]">"{text}"</p>
      <div className="flex items-center gap-3 border-t border-[var(--border-subtle)] pt-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--bg-layer-2)] text-sm font-semibold text-[var(--accent)]">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">{name}</p>
          <p className="text-xs text-[var(--text-tertiary)]">{location}</p>
        </div>
      </div>
    </div>
  );
}

function Home() {
  const locale = useMemo(
    () => (typeof navigator !== "undefined" ? navigator.language : "en-GB"),
    [],
  );
  const [currency, setCurrency] = useState<string>(BASE_CURRENCY);
  const [rates, setRates] = useState<Record<string, number>>({ GBP: 1 });
  const [live, setLive] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // GBP is the billing currency, so it is what everyone sees by default (the
  // target market is USA + UK). An explicit earlier choice is honoured; we no
  // longer switch the display behind the visitor's back from their locale.
  useEffect(() => {
    const saved = loadSavedCurrency();
    if (saved && saved !== BASE_CURRENCY) setCurrency(saved);
  }, []);

  // Fetch live rates once on mount.
  useEffect(() => {
    let cancelled = false;
    getRates().then((result) => {
      if (cancelled) return;
      setRates(result.rates);
      setLive(result.live);
      setUpdatedAt(result.updatedAt);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Every GBP amount on the page — headline prices, notes, and empty-state
  // labels — goes through this one formatter.
  const fmt: PriceFormatter = (gbp) => formatPrice(gbp, currency, rates, locale);

  return (
    <main className="min-h-dvh overflow-x-hidden" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      {/* ── Structured Data (schema.org) ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "FluentPath Spanish",
            description: "Dialect-specific Spanish tutoring with native teachers for professionals.",
            url: "https://www.fluentpathspanish.com",
          }),
        }}
      />

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center px-6 py-28 text-center">
        <h1 className="font-['Montserrat'] text-5xl font-bold tracking-tight text-[var(--text-primary)] sm:text-6xl">
          The Spanish
          <br />
          Locals Actually Speak.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-[var(--text-secondary)] sm:text-xl">
          Dialect fluency coaching with native teachers. Available 24/7. Precision training for serious learners.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/" hash="pricing" className="btn-primary w-full sm:w-auto">
            Book Free First Session
          </Link>
          <Link to="/" hash="pricing" className="btn-secondary w-full sm:w-auto">
            See Pricing
          </Link>
        </div>
        <div className="mt-8 text-xs text-[var(--text-tertiary)]">
          CEFR B1-C2 · 6 Dialects · Native Teachers · Start for free
        </div>
      </section>

      {/* ── Trust Signals ── */}
      <section className="border-t border-[var(--border-subtle)] py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 px-6 lg:flex lg:flex-wrap lg:justify-center lg:gap-4">
          <TrustPill icon={<IconGraduation />} label="Native Teachers" />
          <TrustPill icon={<IconMap />} label="Dialect Coaching" />
          <TrustPill icon={<IconX />} label="Cancel Anytime" />
          <TrustPill icon={<IconLock />} label="Honest Reviews" />
        </div>
      </section>

      {/* ── Pricing (display-only currency conversion; Stripe stays GBP) ── */}
      <PricingSection
        fmt={fmt}
        currency={currency}
        rates={rates}
        live={live}
        loading={loading}
        updatedAt={updatedAt}
        locale={locale}
        setCurrency={setCurrency}
      />

      {/* ── Free cheat-sheet email capture ──
          Below pricing: readers who are not ready to buy still get something
          genuinely useful. The form renders only once the PDF is actually on
          disk, so the offer is never a promise we cannot keep. Storage only —
          this feature sends no email. */}
      <EmailCapture />

      {/* ── Testimonials Section ── */}
      <section id="reviews" className="border-t border-[var(--border-subtle)] py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <h2 className="font-['Montserrat'] text-3xl font-bold text-[var(--text-primary)]">
              What Our Students Say
            </h2>
            <p className="mt-3 text-[var(--text-secondary)]">
              Verified student reviews only — each one traced to a real purchase or booking. No
              fabrication, ever.
            </p>
          </div>

          {/* ── Review cards grid ──
              Renders every review in src/lib/reviews.ts with its verification
              badge, or the honest "no reviews published yet" state while that
              list is empty. No placeholder testimonials, ever. */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <VerifiedReviews fmt={fmt} />
          </div>

          {/* ── How we verify ── */}
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-[var(--text-tertiary)]">
            Each review here is traced to a real purchase, booking or Google review, and published
            only with the student&apos;s permission. If we cannot verify it, we do not publish it.
          </p>

          {/* ── Google Reviews badge ──
              Rendered as a non-interactive card: there is no Google Business
              Profile yet, so there is no honest URL to send anyone to. Swap this
              for an <a> the day the profile (and its review link) exists. */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-layer-1)] px-6 py-4">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <div className="text-left">
                <p className="text-sm font-semibold text-[var(--text-primary)]">Review us on Google</p>
                <p className="text-xs text-[var(--text-tertiary)]">
                  Profile being set up — no public link yet
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--border-subtle)] py-12 text-center text-xs text-[var(--text-tertiary)]">
        <p>FluentPath Spanish — dialect-specific fluency coaching with native teachers.</p>
        <p className="mt-1">www.fluentpathspanish.com</p>
      </footer>
    </main>
  );
}