import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

/* ── Star rating (read-only) ── */
function Stars({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i <= rating ? "text-[#C8963E]" : "text-[#2A2D3C]"}`}
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
function TrustPill({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-[#1F2130] bg-[#13141C] px-4 py-2 text-sm text-[#A0A0AE]">
      <span className="text-base">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

/* ── Review card (empty state) ── */
function ReviewCardPlaceholder() {
  return (
    <div className="card flex flex-col items-center gap-4 py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#1F2130] text-2xl">
        ⭐
      </div>
      <p className="text-lg font-semibold text-[#EDEDF0]">Be the first to review us!</p>
      <p className="max-w-xs text-sm text-[#A0A0AE]">
        Your feedback helps other learners find the right Spanish coaching. We'd love to hear from you.
      </p>
      <a
        href="https://g.page/r/placeholder" /* replace with real Google Business Profile URL */
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary mt-2"
      >
        Leave a Google Review
      </a>
    </div>
  );
}

/* ── Review card (filled – ready for real reviews) ── */
function ReviewCard({
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
      <p className="text-sm leading-relaxed text-[#A0A0AE]">"{text}"</p>
      <div className="flex items-center gap-3 border-t border-[#1F2130] pt-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1A1C26] text-sm font-semibold text-[#C8963E]">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#EDEDF0]">{name}</p>
          <p className="text-xs text-[#5C5C6A]">{location}</p>
        </div>
      </div>
    </div>
  );
}

function Home() {
  return (
    <main className="min-h-dvh" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      {/* ── Structured Data (schema.org) ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "FluentPath Spanish",
            description: "AI-native Spanish tutoring with dialect-specific coaching for professionals.",
            url: "https://fluentpathspanish.ctonew.app",
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "5.0",
              reviewCount: "0",
              bestRating: "5",
              worstRating: "1",
            },
            review: [],
          }),
        }}
      />

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center px-6 py-28 text-center">
        <h1 className="font-['Montserrat'] text-5xl font-bold tracking-tight text-[#EDEDF0] sm:text-6xl">
          Real-world Spanish,
          <br />
          Engineered for Professionals.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-[#A0A0AE]">
          AI-native fluency coaching. Available 24/7. Precision training for serious learners.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href="#reviews" className="btn-primary">
            Start Free Trial
          </a>
          <a href="#reviews" className="btn-secondary">
            See Student Reviews
          </a>
        </div>
        <div className="mt-8 text-xs text-[#5C5C6A]">
          CEFR B1-C2 · 6 Dialects · AI + Human
        </div>
      </section>

      {/* ── Trust Signals ── */}
      <section className="border-t border-[#1F2130] py-16">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-4 px-6">
          <TrustPill icon="🤖" label="24/7 AI Teacher" />
          <TrustPill icon="🗺️" label="Dialect-Specialized" />
          <TrustPill icon="❌" label="Cancel Anytime" />
          <TrustPill icon="🔒" label="No Fake Reviews" />
        </div>
      </section>

      {/* ── Testimonials Section ── */}
      <section id="reviews" className="border-t border-[#1F2130] py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <h2 className="font-['Montserrat'] text-3xl font-bold text-[#EDEDF0]">
              What Our Students Say
            </h2>
            <p className="mt-3 text-[#A0A0AE]">
              Real reviews from real learners. No fabrication — ever.
            </p>
          </div>

          {/* ── Review cards grid ── */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* ── Placeholder — first review slot ── */}
            <ReviewCardPlaceholder />

            {/* ── Ready review cards (empty until real reviews come in) ── */}
            {/* When real reviews are collected, uncomment and populate:
            <ReviewCard name="María G." location="Barcelona, Spain" rating={5} text="FluentPath helped me master Castilian before my relocation. The AI teacher was available whenever I needed practice." />
            <ReviewCard name="James K." location="London, UK" rating={5} text="Finally a platform that teaches the Spanish I actually need for work. The dialect coaching is a game-changer." />
            */}
          </div>

          {/* ── Google Reviews badge ── */}
          <div className="mt-12 text-center">
            <a
              href="https://g.page/r/placeholder"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-xl border border-[#1F2130] bg-[#13141C] px-6 py-4 transition hover:border-[#2A2D3C]"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <div className="text-left">
                <p className="text-sm font-semibold text-[#EDEDF0]">Review us on Google</p>
                <p className="text-xs text-[#5C5C6A]">Share your experience</p>
              </div>
              <span className="text-[#A0A0AE]">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#1F2130] py-12 text-center text-xs text-[#5C5C6A]">
        <p>FluentPath Spanish — AI-native, dialect-specific fluency coaching.</p>
        <p className="mt-1">fluentpathspanish.ctonew.app</p>
      </footer>
    </main>
  );
}