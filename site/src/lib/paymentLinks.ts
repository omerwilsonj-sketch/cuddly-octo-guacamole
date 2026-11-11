/* ── Stripe Payment Links ──
   Live Payment Links. Stripe is always charged in GBP; the on-page currency
   conversion is display-only. Updated 2026-09-16: the Monthly and Annual
   subscription products were recreated with clean copy (no "AI" branding).
   INTERIM STATE (2026-10-06): the one-off product links below still complete
   checkout on the original Stripe account. Subscription checkout is disabled
   in the UI (index.tsx renders an honest notice) because recurring billing
   needs the full Stripe experience — links will be recreated on the new
   connected account and subscriptions re-enabled then. */
export const STRIPE_LINKS = {
  monthly: "https://buy.stripe.com/14A6oH1dJ8Pz2S54sacwg10",
  annual: "https://buy.stripe.com/8x2eVde0v8Pz3W97Emcwg11",
  oneOnOne: "https://buy.stripe.com/14A8wP6y33vfgIVaQycwg0W",
  pack5: "https://buy.stripe.com/bJefZh8Gbd5P1O1bUCcwg0X",
  pack10: "https://buy.stripe.com/9B6dR96y37Lv78l2k2cwg0Y",
  groupClass: "https://buy.stripe.com/3cI7sL1dJe9TeANe2Kcwg0Z",
} as const;

export type StripeLinkKey = keyof typeof STRIPE_LINKS;
