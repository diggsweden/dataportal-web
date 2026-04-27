import type { Metadata } from "next";

import { SettingsUtil } from "@/env";
import { includeLangInPath } from "@/utilities/check-lang";

const SITE_NAME = "Sveriges Dataportal";
const TITLE_SUFFIX = ` - ${SITE_NAME}`;

export interface BuildPageMetadataInput {
  locale: string;
  /**
   * Route path with leading slash, e.g. `/nyheter`, `/nyheter/some-slug`,
   * or `/` for the start page. The locale prefix is added automatically
   * via {@link includeLangInPath}.
   */
  path: string;
  /**
   * Page title without the site-name suffix. The helper appends
   * `" - Sveriges Dataportal"` automatically. Pass `null`/`undefined`
   * (or empty string) to fall back to just the site name.
   */
  title?: string | null;
  /**
   * Skip the automatic `" - Sveriges Dataportal"` suffix. Useful when
   * `title` already contains a fully formed brand string.
   */
  skipTitleSuffix?: boolean;
  description?: string | null;
  /**
   * Absolute or root-relative URL for the social card image. Pass the
   * already-resolved URL (the helper does not prepend a media base).
   */
  ogImage?: string | null;
  ogType?: "website" | "article";
  /** CMS overrides — both default to `true` (allow). */
  robotsFollow?: boolean | null;
  robotsIndex?: boolean | null;
}

/**
 * Builds the standard `Metadata` object every CMS route in the App
 * Router emits. Centralises the canonical-URL construction, the prod
 * gate on `robots`, the `openGraph`/`twitter`/`alternates`/`other`
 * shape, and the `" - Sveriges Dataportal"` title suffix.
 *
 * Callers stay responsible for resolving the title text, description,
 * and og-image URL (since those typically blend translations, CMS
 * fields, and fallbacks). The helper just stamps out the boilerplate
 * envelope around them.
 */
export function buildPageMetadata({
  locale,
  path,
  title,
  skipTitleSuffix,
  description,
  ogImage,
  ogType = "website",
  robotsFollow,
  robotsIndex,
}: BuildPageMetadataInput): Metadata {
  const env = SettingsUtil.create();
  const canonicalUrl = `${env.CANONICAL_URL}${includeLangInPath(locale)}${path}`;
  const allowSEO = env.envName === "prod";
  const fullTitle = title
    ? skipTitleSuffix
      ? title
      : `${title}${TITLE_SUFFIX}`
    : SITE_NAME;
  const desc = description ?? undefined;
  const images = ogImage ? [ogImage] : undefined;

  return {
    title: fullTitle,
    description: desc,
    alternates: { canonical: canonicalUrl },
    robots: {
      follow: allowSEO && (robotsFollow ?? true),
      index: allowSEO && (robotsIndex ?? true),
    },
    openGraph: {
      title: fullTitle,
      description: desc,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images,
      type: ogType,
    },
    twitter: {
      title: fullTitle,
      description: desc,
      images,
    },
    other: { language: locale },
  };
}

/**
 * Resolves a CMS image URL into the absolute URL the social-card meta
 * tags expect. Mirrors the inline `mediaBase + url` snippet every page
 * used to spell out. Returns `undefined` when the input is empty so
 * the caller can fall through to a default image.
 */
export function resolveCmsOgImage(url: string | null | undefined) {
  if (!url) return undefined;
  const mediaBase = process.env.REACT_APP_MEDIA_BASE_URL ?? "";
  return `${mediaBase}${url}`;
}
