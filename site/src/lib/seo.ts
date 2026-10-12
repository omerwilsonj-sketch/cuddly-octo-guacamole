// Shared SEO/OpenGraph helpers.
//
// Every route declares its own unique title, description and canonical URL, and
// inherits the site-wide card defaults (site name, locale, image) from the root
// route. Nothing here invents claims: descriptions describe what a visitor
// actually finds on the page, and no review counts, ratings or statistics are
// asserted anywhere (the business publishes no such numbers).

export const SITE_URL = "https://www.fluentpathspanish.com";
export const SITE_NAME = "FluentPath Spanish";

/** 1200×630 brand card used as the default OpenGraph/Twitter image. */
export const DEFAULT_OG_IMAGE = "/og/og-default.png";

export interface SeoInput {
  /** <title> — kept under ~60 characters where possible. */
  title: string;
  /** Meta description — describes the page truthfully, ~150–160 characters. */
  description: string;
  /** Root-relative path of this page, e.g. "/" or "/tiktok". */
  path: string;
  /** Override the default social image (root-relative or absolute URL). */
  image?: string;
  /** OpenGraph object type; "website" unless a page is article-like. */
  type?: "website" | "article";
  /** Set true only for pages that must stay out of search results. */
  noindex?: boolean;
}

const absoluteUrl = (value: string): string =>
  /^https?:\/\//.test(value) ? value : `${SITE_URL}${value.startsWith("/") ? value : `/${value}`}`;

/**
 * Build the `head` payload for a route:
 *
 *   export const Route = createFileRoute("/tiktok")({
 *     head: () => seoHead({ title: "…", description: "…", path: "/tiktok" }),
 *     component: TiktokPage,
 *   });
 */
export function seoHead({ title, description, path, image, type, noindex }: SeoInput) {
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(image ?? DEFAULT_OG_IMAGE);

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: noindex ? "noindex, nofollow" : "index, follow" },
      { property: "og:type", content: type ?? "website" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: ogImage },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: `${SITE_NAME} — Spanish dialect coaching` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
