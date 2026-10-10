import { useEffect, useState } from "react";
import { getCheatsheetStatus, subscribeToCheatsheet } from "~/lib/signups";

/**
 * Homepage email capture for the free dialect cheat-sheet.
 *
 * Two honest states, decided by whether the PDF is actually on disk:
 *  - PDF present  -> the form is live and the download is handed over immediately
 *                    after signup (the promise is fulfilled on the spot).
 *  - PDF missing  -> no form is shown at all, because asking for an email in
 *                    exchange for a file we cannot hand over yet would be a
 *                    promise we cannot keep. It flips to the live form by itself
 *                    the moment the file lands and the site is published.
 */

type View = "checking" | "form" | "done" | "unavailable";

const CONSENT_TEXT =
  "Email me the cheat-sheet and occasional FluentPath updates — unsubscribe anytime";

export function EmailCapture() {
  const [view, setView] = useState<View>("checking");
  const [downloadPath, setDownloadPath] = useState("/assets/cheatsheet/dialect-cheatsheet.pdf");
  const [downloadReady, setDownloadReady] = useState(false);
  const [alreadyOnList, setAlreadyOnList] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    getCheatsheetStatus()
      .then((status) => {
        if (!alive) return;
        setDownloadPath(status.path);
        setDownloadReady(status.ready);
        setView(status.ready ? "form" : "unavailable");
      })
      .catch(() => {
        if (!alive) return;
        setView("unavailable");
      });
    return () => {
      alive = false;
    };
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!consent) {
      setError("Please tick the consent box so we can keep you posted.");
      return;
    }

    setBusy(true);
    try {
      const result = await subscribeToCheatsheet({
        data: { email, name, consent },
      });
      if (!result.ok) {
        setError(result.error ?? "Something went wrong. Please try again.");
        return;
      }
      setDownloadPath(result.downloadPath);
      setDownloadReady(result.downloadReady);
      setAlreadyOnList(result.status === "already");
      setView("done");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="cheatsheet" className="border-t border-[var(--border-subtle)] py-20">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <h2 className="font-['Montserrat'] text-3xl font-bold text-[var(--text-primary)]">
            Free dialect cheat-sheet
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[var(--text-secondary)]">
            The words that mean something different in every Spanish-speaking country — and the ones
            to avoid entirely. One page, no grammar drills, yours to keep.
          </p>
        </div>

        {view === "checking" ? (
          <div className="card mx-auto mt-8 h-40 animate-pulse" aria-hidden="true" />
        ) : null}

        {view === "unavailable" ? (
          <div className="card mx-auto mt-8 max-w-xl text-center">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              The cheat-sheet is being finished — it goes live here shortly.
            </p>
            <p className="mt-2 text-xs text-[var(--text-tertiary)]">
              We are not collecting email addresses for it until the download actually works.
            </p>
          </div>
        ) : null}

        {view === "form" ? (
          <form onSubmit={onSubmit} className="card mx-auto mt-8 max-w-xl" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-left">
                <span className="text-xs font-semibold tracking-wide text-[var(--text-secondary)] uppercase">
                  Email
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-layer-2)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
                />
              </label>
              <label className="flex flex-col gap-2 text-left">
                <span className="text-xs font-semibold tracking-wide text-[var(--text-secondary)] uppercase">
                  First name <span className="font-normal normal-case">(optional)</span>
                </span>
                <input
                  type="text"
                  name="name"
                  autoComplete="given-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Alex"
                  className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-layer-2)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
                />
              </label>
            </div>

            <label className="mt-4 flex items-start gap-3 text-left">
              <input
                type="checkbox"
                name="consent"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]"
              />
              <span className="text-xs leading-relaxed text-[var(--text-secondary)]">
                {CONSENT_TEXT}
              </span>
            </label>

            {error ? (
              <p className="mt-3 text-sm font-semibold text-[var(--accent)]" role="alert">
                {error}
              </p>
            ) : null}

            <div className="mt-5 flex flex-col items-center gap-2">
              <button type="submit" className="btn-primary w-full sm:w-auto" disabled={busy}>
                {busy ? "Getting it ready…" : "Get the cheat-sheet"}
              </button>
              <p className="text-xs text-[var(--text-tertiary)]">
                Instant download · No spam · Unsubscribe anytime
              </p>
            </div>
          </form>
        ) : null}

        {view === "done" ? (
          <div className="card mx-auto mt-8 max-w-xl text-center">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {alreadyOnList
                ? "You are already on the list — here is your cheat-sheet."
                : "You are on the list."}
            </p>
            {downloadReady ? (
              <a
                href={downloadPath}
                download
                className="btn-primary mt-5 inline-block"
                data-testid="cheatsheet-download"
              >
                Download the cheat-sheet (PDF)
              </a>
            ) : (
              <p className="mt-3 text-xs text-[var(--text-tertiary)]">
                The PDF is not on the site yet — we will flip the download on the moment it lands.
              </p>
            )}
            <p className="mt-3 text-xs text-[var(--text-tertiary)]">
              Occasional FluentPath updates only — every one has an unsubscribe link.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
