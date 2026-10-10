import { createServerFn } from "@tanstack/react-start";

/**
 * Cheat-sheet signups — storage only.
 *
 * There is deliberately NO email sending in this module: the visitor gets the
 * cheat-sheet as an instant download and a JSONL row is appended so the team can
 * (later, with the owner's go-ahead and an unsubscribe mechanism) send updates.
 * Nothing here contacts anyone.
 *
 * Storage: one JSON object per line at `$SIGNUPS_FILE`, or `<app dir>/data/signups.jsonl`.
 * The file is created on first signup. An existing email is not appended twice —
 * the row already on file wins, and the caller is told it was already there.
 *
 * NOTE: `node:fs`/`node:path` are imported lazily inside the handlers so this
 * module stays importable from client code (createServerFn replaces the handler
 * with an RPC stub, but a top-level `node:` import would still break the bundle).
 */

export const CHEATSHEET_PATH = "/assets/cheatsheet/dialect-cheatsheet.pdf";
export const CHEATSHEET_NAME = "FluentPath Spanish — dialect cheat-sheet (PDF)";

const MAX_EMAIL = 254;
const MAX_NAME = 60;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

function cleanEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const email = raw.trim().toLowerCase().replace(/\s+/g, "");
  if (!email || email.length > MAX_EMAIL) return null;
  return EMAIL_RE.test(email) ? email : null;
}

function cleanName(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw.replace(/\s+/g, " ").trim().slice(0, MAX_NAME);
}

async function signupsFile(): Promise<string> {
  const { join } = await import("node:path");
  const override = process.env.SIGNUPS_FILE;
  if (override && override.trim()) return override.trim();
  return join(process.cwd(), "data", "signups.jsonl");
}

/**
 * The PDF is served from the site's static root, which is `<app>/public` while
 * developing and `<app>/dist/client` once built. The app directory is normally
 * the working directory, but the live host is free to start the server from a
 * different one, so we also walk up from this module's own location. A hit means
 * the file really is servable — that is what the UI is allowed to promise.
 */
async function cheatsheetExists(): Promise<boolean> {
  const { join, dirname, resolve } = await import("node:path");
  const { access } = await import("node:fs/promises");

  const roots: string[] = [];
  let cwd = process.cwd();
  for (let i = 0; i < 3; i += 1) {
    roots.push(cwd);
    cwd = dirname(cwd);
  }
  try {
    const here = dirname(new URL(import.meta.url).pathname);
    let dir = here;
    for (let i = 0; i < 4; i += 1) {
      roots.push(dir);
      dir = dirname(dir);
    }
  } catch {
    /* no module URL (unlikely) — the cwd walk above still applies */
  }

  const seen = new Set<string>();
  for (const root of roots) {
    for (const sub of ["public", "dist/client"]) {
      const candidate = resolve(join(root, sub, CHEATSHEET_PATH));
      if (seen.has(candidate)) continue;
      seen.add(candidate);
      try {
        await access(candidate);
        return true;
      } catch {
        /* try the next location */
      }
    }
  }
  return false;
}

export type CheatsheetStatus = {
  /** True when the PDF is actually on disk — the UI must not promise a download before this. */
  ready: boolean;
  path: string;
  name: string;
};

/** Tells the page whether the cheat-sheet file is live yet, so no promise is made too early. */
export const getCheatsheetStatus = createServerFn({ method: "GET" }).handler(
  async (): Promise<CheatsheetStatus> => ({
    ready: await cheatsheetExists(),
    path: CHEATSHEET_PATH,
    name: CHEATSHEET_NAME,
  }),
);

export type SignupInput = {
  email: string;
  name?: string;
  consent: boolean;
};

export type SignupResult = {
  ok: boolean;
  /** "stored" = appended now, "already" = this email was already on the list. */
  status: "stored" | "already";
  downloadPath: string;
  downloadName: string;
  downloadReady: boolean;
  error?: string;
};

export const subscribeToCheatsheet = createServerFn({ method: "POST" })
  .inputValidator((input: unknown): SignupInput => {
    const raw = (input ?? {}) as Record<string, unknown>;
    return {
      email: typeof raw.email === "string" ? raw.email : "",
      name: typeof raw.name === "string" ? raw.name : "",
      consent: raw.consent === true,
    };
  })
  .handler(async ({ data }): Promise<SignupResult> => {
    const downloadReady = await cheatsheetExists();
    const base: Omit<SignupResult, "status" | "ok" | "error"> = {
      downloadPath: CHEATSHEET_PATH,
      downloadName: CHEATSHEET_NAME,
      downloadReady,
    };

    const email = cleanEmail(data.email);
    if (!email) {
      return { ...base, ok: false, status: "stored", error: "Please enter a valid email address." };
    }
    // Explicit consent is required — no pre-ticked box, no implied opt-in.
    if (data.consent !== true) {
      return {
        ...base,
        ok: false,
        status: "stored",
        error: "Please tick the consent box so we can keep you posted.",
      };
    }
    const name = cleanName(data.name);

    const { readFile, writeFile, mkdir, appendFile } = await import("node:fs/promises");
    const { dirname } = await import("node:path");
    const file = await signupsFile();

    let existing = "";
    try {
      existing = await readFile(file, "utf8");
    } catch {
      existing = ""; // first signup — the file does not exist yet
    }

    const already = existing
      .split("\n")
      .filter(Boolean)
      .some((line) => {
        try {
          return (JSON.parse(line) as { email?: string }).email === email;
        } catch {
          return false;
        }
      });

    if (already) {
      return { ...base, ok: true, status: "already" };
    }

    const row = {
      email,
      name,
      timestamp: new Date().toISOString(),
      source: "homepage",
      consent: true,
      consent_text:
        "Email me the cheat-sheet and occasional FluentPath updates — unsubscribe anytime",
      deliverable: CHEATSHEET_PATH,
    };

    try {
      await mkdir(dirname(file), { recursive: true });
      // JSONL append: one row per signup, never rewritten, so nothing can be lost
      // by a concurrent write. Create-with-flag only for the very first row.
      if (existing === "") {
        await writeFile(file, JSON.stringify(row) + "\n", { encoding: "utf8", flag: "wx" }).catch(
          async () => {
            await appendFile(file, JSON.stringify(row) + "\n", "utf8");
          },
        );
      } else {
        await appendFile(file, JSON.stringify(row) + "\n", "utf8");
      }
    } catch (error) {
      // Honest failure: the cheat-sheet is still delivered, but we say the signup
      // did not stick rather than pretending it did.
      console.error("[signups] could not append signup:", error);
      return {
        ...base,
        ok: false,
        status: "stored",
        error: "We could not save your details just now — but your cheat-sheet is ready below.",
      };
    }

    return { ...base, ok: true, status: "stored" };
  });
