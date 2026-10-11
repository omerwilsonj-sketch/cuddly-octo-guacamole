import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0D0D12" },
      // Site-wide defaults. Each route sets its own title, description,
      // canonical and og:title/description/url via src/lib/seo.ts; these entries
      // are the fallback for that route-level head.
      { title: "FluentPath Spanish — Dialect Coaching with Native Teachers" },
      {
        name: "description",
        content:
          "Spanish teachers available 24/7 with dialect-specific coaching — Mexican, Castilian, Argentinian, Chilean and more. Conversational fluency for professionals, expats and learners.",
      },
      { property: "og:site_name", content: "FluentPath Spanish" },
      { property: "og:locale", content: "en_GB" },
      { property: "og:image", content: "https://www.fluentpathspanish.com/og/og-default.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    // No canonical here on purpose: link tags are not deduplicated the way meta
    // tags are, so a root-level canonical would render alongside each route's
    // own one and give every page two conflicting canonicals. Routes set theirs
    // through seoHead() in src/lib/seo.ts.
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  notFoundComponent: () => <div>Page not found</div>,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

/* ── Theme toggle (sun/moon) ── */
function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // The inline <head> script already set data-theme before first paint; sync the
  // icon to it after mount (avoids a server/client icon mismatch during hydration).
  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage may be unavailable (private mode); theme still applies for this session.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-strong)] text-[var(--text-primary)] transition hover:border-[var(--text-secondary)]"
    >
      {theme === "dark" ? (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/* Apply saved theme (or system preference) before first paint to avoid a flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var s=localStorage.getItem('theme');var t=(s==='light'||s==='dark')?s:(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();",
          }}
        />
      </head>
      <body>
        <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <a href="/" className="font-['Montserrat'] text-base font-bold text-[var(--text-primary)] sm:text-lg">
              FluentPath <span className="text-[var(--accent)]">Spanish</span>
            </a>
            <nav className="flex items-center gap-2 text-[0.8125rem] font-medium sm:gap-3 sm:text-sm">
              <a
                href="/quiz/dialect"
                className="text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
              >
                Dialect Quiz
              </a>
              <a
                href="/quiz/false-friends"
                className="text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
              >
                False Friends
              </a>
            </nav>
            <ThemeToggle />
          </div>
        </header>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
