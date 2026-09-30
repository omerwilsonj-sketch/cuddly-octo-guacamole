// Verified student reviews — the single source of truth for the reviews section.
//
// POLICY (owner-mandated, see the business plan's "radical honesty in
// marketing" principle): we publish only reviews we can verify, and we never
// invent one. Zero customers means zero reviews, and an empty list here means
// the site shows an honest empty state — no star rating, no review count and no
// testimonial is implied anywhere else.
//
// A review may only be added to this array when all of the following hold:
//   1. It comes from a real student — someone who paid for a session, a pack or
//      a subscription (or booked one and was verified by email).
//   2. The evidence trail is recorded in `reference` (the Stripe payment id, the
//      Google review permalink, or the email thread id) and `verifiedOn`.
//   3. The student has agreed to their name, location and words being published.
//
// Never add placeholder, example, translated or "representative" entries — not
// even for design previews. Editing this file is the only step needed to
// publish a genuine review; the UI below renders whatever is really here.

export type ReviewSource = "stripe-payment" | "google-review" | "email";

export interface VerifiedReview {
  /** The student's name, exactly as they agreed it be published. */
  name: string;
  location: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  /** How we confirmed the person really is a student. */
  verifiedVia: ReviewSource;
  /** Pointer to the evidence, so any claim on the page can be traced. */
  reference: string;
  /** ISO date (YYYY-MM-DD) the review was verified. */
  verifiedOn: string;
}

export const VERIFIED_REVIEWS: VerifiedReview[] = [];

export const verifiedReviewCount = VERIFIED_REVIEWS.length;

export const hasVerifiedReviews = verifiedReviewCount > 0;

export const REVIEW_SOURCE_LABELS: Record<ReviewSource, string> = {
  "stripe-payment": "Verified purchase",
  "google-review": "Verified Google review",
  email: "Verified by email",
};
