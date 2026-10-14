import { createServerFn } from "@tanstack/react-start";

/**
 * Cheat-sheet signups — storage only, in Postgres.
 *
 * There is deliberately NO email sending in this module: the visitor gets the
 * cheat-sheet as an instant download and their address is stored so the team can
 * write to them later. Nothing here contacts anyone.
 *
 * Storage is the owner's Postgres (`DATABASE_URL`), so consented leads survive
 * publishes and redeploys — host disk does not. It uses postgres.js (a standard
 * Postgres driver), so any Postgres URL works: Tiger Cloud, Neon, Supabase, RDS.
 * The table is created on first use and duplicates are skipped in SQL, so
 * concurrent signups cannot corrupt or duplicate the list.
 *
 * If `DATABASE_URL` is not set, nothing is claimed: the status reports
 * `storage: false` and the form is replaced by a plain download, so we never tell
 * a visitor they are on a list we cannot write to.
 *
 * NOTE: `postgres` is imported lazily inside the handler so the client bundle
 * never sees a database driver.
 */

export const CHEATSHEET_PATH = "/assets/cheatsheet/dialect-cheatsheet.pdf";
export const CHEATSHEET_NAME = "FluentPath Spanish — dialect cheat-sheet (PDF)";

const MAX_EMAIL = 254;
const MAX_NAME = 60;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

/** Minimal shape of the postgres.js client we use — keeps TS happy without its generics. */
type SqlClient = {
  (strings: TemplateStringsArray, ...values: unknown[]): Promise<Record<string, unknown>[]>;
  end: (options?: { timeout?: number }) => Promise<void>;
};

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

function databaseUrl(): string | null {
  const url = process.env.DATABASE_URL;
  return url && url.trim() ? url.trim() : null;
}

let warnedNoDatabase = false;

/** Server-side breadcrumb, once per process, so the gap is visible in the logs and not just the UI. */
function warnOnceNoDatabase(): void {
  if (warnedNoDatabase) return;
  warnedNoDatabase = true;
  console.warn(
    "[signups] DATABASE_URL is not set — the cheat-sheet form stays hidden so no address is collected that cannot be stored.",
  );
}

/**
 * One short-lived connection per call: the site is low-traffic and this cannot
 * leak a pool across serverless invocations or a hot reload.
 */
async function withSql<T>(run: (sql: SqlClient) => Promise<T>): Promise<T> {
  const url = databaseUrl();
  if (!url) throw new Error("DATABASE_URL is not set");
  const { default: postgres } = await import("postgres");
  const sql = postgres(url, {
    max: 1,
    idle_timeout: 2,
    connect_timeout: 10,
    // Managed Postgres (Tiger Cloud, Neon, Supabase…) needs TLS.
    ssl: url.includes("sslmode=disable") || url.includes("localhost") ? false : "prefer",
  }) as unknown as SqlClient;
  try {
    return await run(sql);
  } finally {
    await sql.end({ timeout: 5 }).catch(() => {});
  }
}

/** Idempotent — safe to run on every signup, creates nothing if the table exists. */
const ensureTable = (sql: SqlClient) => sql`
  create table if not exists signups (
    id serial,
    email text unique,
    first_name text,
    source text,
    consent_at timestamptz default now()
  )
`;

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
  /** True when a database is configured — without it we cannot honestly claim to save anyone. */
  storage: boolean;
  path: string;
  name: string;
};

/** Tells the page what it may promise: the download, and whether sign-ups can be stored. */
export const getCheatsheetStatus = createServerFn({ method: "GET" }).handler(
  async (): Promise<CheatsheetStatus> => {
    const storage = databaseUrl() !== null;
    if (!storage) warnOnceNoDatabase();
    return {
      ready: await cheatsheetExists(),
      storage,
      path: CHEATSHEET_PATH,
      name: CHEATSHEET_NAME,
    };
  },
);

export type SignupInput = {
  email: string;
  name?: string;
  consent: boolean;
};

export type SignupResult = {
  ok: boolean;
  /** "stored" = added now, "already" = this email was already on the list. */
  status: "stored" | "already";
  downloadPath: string;
  downloadName: string;
  downloadReady: boolean;
  error?: string;
};

export const subscribeToCheatsheet = createServerFn({ method: "POST" })
  .validator((input: unknown): SignupInput => {
    const raw = (input ?? {}) as Record<string, unknown>;
    return {
      email: typeof raw.email === "string" ? raw.email : "",
      name: typeof raw.name === "string" ? raw.name : "",
      consent: raw.consent === true,
    };
  })
  .handler(async ({ data }): Promise<SignupResult> => {
    const downloadReady = await cheatsheetExists();
    const base = {
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
    const firstName = cleanName(data.name);

    // A submit can still arrive from a page that was open before the database went away.
    // Say so, log it, and hand over the download without pretending anything was saved.
    if (databaseUrl() === null) {
      warnOnceNoDatabase();
      console.warn("[signups] signup received while DATABASE_URL is unset — nothing was stored.");
      return {
        ...base,
        ok: false,
        status: "stored",
        error:
          "Our subscriber list is not connected yet, so nothing was saved — your cheat-sheet is ready below.",
      };
    }

    try {
      const status = await withSql(async (sql) => {
        await ensureTable(sql);
        const rows = await sql`
          insert into signups (email, first_name, source)
          values (${email}, ${firstName}, ${"homepage"})
          on conflict (email) do nothing
          returning id
        `;
        return rows.length > 0 ? ("stored" as const) : ("already" as const);
      });
      return { ...base, ok: true, status };
    } catch (error) {
      // Honest failure: the cheat-sheet is still delivered, but we say the signup
      // did not stick rather than telling someone they are on a list we cannot write to.
      console.error("[signups] could not store signup:", error);
      return {
        ...base,
        ok: false,
        status: "stored",
        error:
          "We could not save your details just now — your cheat-sheet is ready below, and nothing was stored.",
      };
    }
  });
