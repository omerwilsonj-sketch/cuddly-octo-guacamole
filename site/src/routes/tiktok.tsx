import { createFileRoute, Link } from "@tanstack/react-router";
import { seoHead } from "~/lib/seo";

export const Route = createFileRoute("/tiktok")({
  head: () =>
    seoHead({
      title: "Spanish Dialect Shorts — Watch the Reel Bank | FluentPath Spanish",
      description:
        "Short videos on how Spanish really differs by country: Chilean speed, Madrid first-week phrases, Buenos Aires voseo, Colombian “¿qué más?”. Plus the caption kit we use.",
      path: "/tiktok",
    }),
  component: ReelBankPage,
});

/* ── The reel bank ──
   Four of the sixteen shorts are playable here; each is labelled with the
   dialect it teaches. Files live in site/public/tiktok/ and are served as-is,
   so the titles below describe what the videos actually cover — nothing here
   is a claim about reviews, ratings or student numbers. */
const REELS: { src: string; title: string; dialect: string }[] = [
  {
    src: "/tiktok/reel12_chilean_speed.mp4",
    title: "Why Chilean Spanish sounds so fast",
    dialect: "Chilean",
  },
  {
    src: "/tiktok/reel14_madrid_first_week.mp4",
    title: "Your first week in Madrid: the phrases you actually need",
    dialect: "Castilian",
  },
  {
    src: "/tiktok/reel15_buenos_aires_coffee.mp4",
    title: "Ordering coffee in Buenos Aires (and why “vos” changes everything)",
    dialect: "Rioplatense",
  },
  {
    src: "/tiktok/reel16_colombia_que_mas.mp4",
    title: "Colombian greetings: what “¿qué más?” really means",
    dialect: "Colombian",
  },
];

function ReelBankPage() {
  return (
    <main
      className="min-h-dvh"
      style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}
    >
      <section className="mx-auto max-w-4xl px-6 py-20">
        <Link to="/" className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]">
          ← FluentPath Spanish
        </Link>

        <h1 className="mt-8 font-['Montserrat'] text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
          Spanish dialect shorts
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-[var(--text-secondary)]">
          Sixteen short videos on how Spanish actually differs from country to country — the words,
          the speed, and the phrases that mark you as a visitor. Four of them play below.
        </p>

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {REELS.map((reel) => (
            <figure key={reel.src} className="card overflow-hidden">
              <video
                className="w-full rounded-t-2xl bg-black"
                src={reel.src}
                controls
                preload="none"
                playsInline
              />
              <figcaption className="px-5 py-4">
                <span className="inline-flex items-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-layer-2)] px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-[var(--accent)]">
                  {reel.dialect}
                </span>
                <p className="mt-3 text-sm text-[var(--text-secondary)]">{reel.title}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <section className="mt-14 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-layer-1)] p-6">
          <h2 className="font-['Montserrat'] text-xl font-bold text-[var(--text-primary)]">
            The caption kit
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            The per-video captions we write for TikTok and Instagram — hooks, hashtags and the
            link-in-bio CTA — are published as a plain text file you can read in full:
          </p>
          <a
            href="/tiktok/tiktok-profile-kit.txt"
            className="btn-secondary mt-4 inline-flex"
            rel="noopener"
          >
            Read the caption kit (text file)
          </a>
          <p className="mt-3 text-xs text-[var(--text-tertiary)]">
            Also served at /tiktok/tiktok-profile-kit.txt
          </p>
        </section>

        <section className="mt-14">
          <h2 className="font-['Montserrat'] text-2xl font-bold text-[var(--text-primary)]">
            The Spanish behind the shorts
          </h2>
          <p className="mt-3 max-w-2xl text-[var(--text-secondary)]">
            Short videos are the appetiser. The work happens in live, dialect-specific sessions with
            a native teacher — Castilian, Mexican, Argentinian, Chilean, Colombian and more — for
            professionals, expats and anyone rebuilding fluency they lost.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/" hash="pricing" className="btn-primary">
              See pricing
            </Link>
            <Link to="/" className="btn-secondary">
              What we teach
            </Link>
          </div>
        </section>

        <p className="mt-16 text-xs text-[var(--text-tertiary)]">
          FluentPath Spanish — dialect-specific fluency coaching with native teachers.
        </p>
      </section>
    </main>
  );
}
