import {
  REVIEW_SOURCE_LABELS,
  VERIFIED_REVIEWS,
  hasVerifiedReviews,
  type VerifiedReview,
} from "~/lib/reviews";

/* ── Star rating (read-only) ── */
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i <= rating ? "text-[var(--accent)]" : "text-[var(--border-strong)]"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/* ── Verified review card ──
   Every card states how the reviewer was verified and when. If a review cannot
   show that line, it does not belong on the page. */
export function VerifiedReviewCard({ review }: { review: VerifiedReview }) {
  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <Stars rating={review.rating} />
        <span
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-layer-2)] px-3 py-1 text-[0.7rem] font-semibold text-[var(--accent)]"
          title={`${REVIEW_SOURCE_LABELS[review.verifiedVia]} · verified ${review.verifiedOn}`}
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 111.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z"
              clipRule="evenodd"
            />
          </svg>
          {REVIEW_SOURCE_LABELS[review.verifiedVia]}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-[var(--text-secondary)]">"{review.text}"</p>
      <div className="flex items-center gap-3 border-t border-[var(--border-subtle)] pt-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--bg-layer-2)] text-sm font-semibold text-[var(--accent)]">
          {review.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">{review.name}</p>
          <p className="text-xs text-[var(--text-tertiary)]">
            {review.location} · verified {review.verifiedOn}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Honest empty state ──
   Shown while no verified review exists. It says exactly that, and explains the
   rule — rather than dressing up a slot with invented social proof. */
export function VerifiedReviewsEmptyState() {
  return (
    <div className="card flex flex-col items-center gap-4 py-12 text-center md:col-span-2 lg:col-span-3">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-layer-2)] px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-[var(--accent)]">
        Founding students
      </span>
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-layer-2)] text-2xl">
        ⭐
      </div>
      <p className="text-lg font-semibold text-[var(--text-primary)]">Be the first to review us</p>
      <p className="max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
        We only publish reviews we can verify — a real student, with the purchase or booking on
        record. We&apos;re just getting started, so this section stays empty until a real student
        has something honest to say. No invented ratings, no borrowed quotes, no stock
        testimonials.
      </p>
      <p className="max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
        Be one of our first students and your honest feedback — good or bad — becomes the first
        review here. Your first session is free, and a subscription is £19/month.
      </p>
      <a href="#pricing" className="btn-primary mt-2">
        Start with a free session
      </a>
    </div>
  );
}

/* ── The reviews grid: real verified reviews, or the honest empty state ── */
export function VerifiedReviews() {
  if (!hasVerifiedReviews) return <VerifiedReviewsEmptyState />;
  return (
    <>
      {VERIFIED_REVIEWS.map((review) => (
        <VerifiedReviewCard key={`${review.name}-${review.verifiedOn}`} review={review} />
      ))}
    </>
  );
}
