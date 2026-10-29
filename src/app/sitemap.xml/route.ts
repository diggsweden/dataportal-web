import type http from "node:http";
import url from "node:url";

import fetchEnhanced from "fetch-enhanced";
import { HttpsProxyAgent } from "https-proxy-agent";
import nodeFetch from "node-fetch";
import { GoodExamplePreviewsDocument } from "@/app/[locale]/(content)/(publications)/(examples)/data";
import { NewsItemPreviewsDocument } from "@/app/[locale]/(content)/(publications)/nyheter/data";
import { ContainersDocument } from "@/app/[locale]/(content)/[...containerSlug]/data";
import { SettingsUtil } from "@/env";
import { gqlFetch, logGqlError } from "@/graphql/fetcher";
import {
  ContainerDataFragment as ContainerDataDoc,
  GoodExampleBlockItemFragment as GoodExampleBlockItemDoc,
  NewsBlockItemFragment as NewsBlockItemDoc,
} from "@/graphql/fragments";
import { getFragmentData } from "@/graphql/gql";
import type {
  ContainerDataFragment,
  GoodExampleBlockItemFragment,
  NewsBlockItemFragment,
} from "@/graphql/gql/graphql";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { includeLangInPath } from "@/utilities/check-lang";

/**
 * Generate at request time; caching is delegated to the CDN via
 * `Cache-Control: public, s-maxage=10, stale-while-revalidate=59`.
 */
export const dynamic = "force-dynamic";

const proxyfetch = fetchEnhanced(nodeFetch);
const env = SettingsUtil.create();

type ContainerLike =
  | ContainerDataFragment
  | NewsBlockItemFragment
  | GoodExampleBlockItemFragment;

const slug = (c: ContainerLike | null): string => {
  if (!c) return "";
  const path = `${includeLangInPath(c.locale ?? routing.defaultLocale)}${c.slug ?? ""}`;
  if (c.__typename === "dataportal_Digg_NewsItem_Preview")
    return `/nyheter${path}`;
  if (c.__typename === "dataportal_Digg_GoodExample_Preview") {
    return `/exempel-datadriven-transformation${path}`;
  }
  return path;
};

/**
 * Fetch the full dataset list from the MetaSolutions JSON sitemap.
 * Honours the egress proxy configured via `HTTP_PROXY` / `HTTP_PROXY_USER`
 * / `HTTP_PROXY_PASS`.
 */
const getDatasets = async (): Promise<
  Array<{
    cid: string;
    eid: string;
    modified: string;
  }>
> => {
  const proxy_url = process.env.HTTP_PROXY || "";
  const proxy_user = process.env.HTTP_PROXY_USER;
  const proxy_pass = process.env.HTTP_PROXY_PASS;

  if (proxy_url.length > 0) {
    const proxy_uri = url.parse(proxy_url);

    if (proxy_user && proxy_pass) {
      proxy_uri.auth = `${proxy_user}:${proxy_pass}`;
    }

    const proxy = new HttpsProxyAgent(proxy_uri);

    const response = await proxyfetch(env.ENTRYSCAPE_SITEMAP_JSON_URL, {
      // `https-proxy-agent@5` doesn't match the newer `http.Agent` surface
      // in `@types/node@20`. Tracked for removal when the dep is bumped.
      agent: proxy as unknown as http.Agent,
    });

    if (response.ok && response.status === 200) {
      return (await response.json()) as Array<{
        cid: string;
        eid: string;
        modified: string;
      }>;
    }
    console.error({ message: "proxy fetch error", response });
    return [];
  }

  const response = await fetch(env.ENTRYSCAPE_SITEMAP_JSON_URL);
  if (response.ok && response.status === 200) {
    return (await response.json()) as Array<{
      cid: string;
      eid: string;
      modified: string;
    }>;
  }
  return [];
};

export async function GET(): Promise<Response> {
  const datasets = await getDatasets().catch((error) => {
    console.error({ message: "sitemap: dataset fetch failed", error });
    return [];
  });

  const allContainers: (ContainerDataFragment | null)[] = [];
  const allNewsItems: (NewsBlockItemFragment | null)[] = [];
  const allGoodExamples: (GoodExampleBlockItemFragment | null)[] = [];

  // `routing.locales` is the source of truth for which locales to emit.
  await Promise.all(
    routing.locales.map(async (locale) => {
      try {
        const [containerResult, newsResult, goodExampleResult] =
          await Promise.all([
            gqlFetch(
              ContainersDocument,
              { filter: { locale, limit: 9999 } },
              { revalidate: 3600, tags: ["strapi", "sitemap"] },
            ),
            gqlFetch(
              NewsItemPreviewsDocument,
              { filter: { locale, limit: 9999 } },
              { revalidate: 3600, tags: ["strapi", "sitemap"] },
            ),
            gqlFetch(
              GoodExamplePreviewsDocument,
              { filter: { locale, limit: 9999 } },
              { revalidate: 3600, tags: ["strapi", "sitemap"] },
            ),
          ]);

        if (containerResult?.dataportal_Digg_Containers) {
          allContainers.push(
            ...containerResult.dataportal_Digg_Containers.map((c) =>
              getFragmentData(ContainerDataDoc, c),
            ),
          );
        }
        if (newsResult?.dataportal_Digg_News_Item_Previews) {
          allNewsItems.push(
            ...newsResult.dataportal_Digg_News_Item_Previews.map((n) =>
              getFragmentData(NewsBlockItemDoc, n),
            ),
          );
        }
        if (goodExampleResult?.dataportal_Digg_Good_Example_Previews) {
          allGoodExamples.push(
            ...goodExampleResult.dataportal_Digg_Good_Example_Previews.map(
              (g) => getFragmentData(GoodExampleBlockItemDoc, g),
            ),
          );
        }
      } catch (error) {
        logGqlError(error);
      }
    }),
  );

  // Entryscape pages keep the same slug in both locales; only the prefix
  // differs. `/statistics` and `/search` have localised slugs.
  const sharedSlugPaths = [
    "/datasets",
    "/specifications",
    "/data-structures",
    "/organisations",
    "/metadatakvalitet",
  ];

  const staticPaths = routing.locales.flatMap((locale) => [
    includeLangInPath(locale),
    ...sharedSlugPaths.map((path) => `${includeLangInPath(locale)}${path}`),
    getPathname({ locale, href: "/statistics" }),
    getPathname({ locale, href: "/search" }),
  ]);

  const now = new Date().toISOString();
  // `<loc>` must XML-escape; the search URLs carry `&` query strings.
  const xml = (v: string): string =>
    v
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  const urlEntry = (loc: string, lastmod: string): string => `
    <url>
        <loc>${xml(loc)}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1.0</priority>
    </url>
`;

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticPaths.map((p) => urlEntry(`${env.CANONICAL_URL}${p}`, now)).join("")}
    ${allContainers.map((c) => urlEntry(`${env.CANONICAL_URL}${slug(c)}`, c?.updatedAt ?? now)).join("")}
    ${allNewsItems.map((n) => urlEntry(`${env.CANONICAL_URL}${slug(n)}`, n?.updatedAt ?? now)).join("")}
    ${allGoodExamples.map((g) => urlEntry(`${env.CANONICAL_URL}${slug(g)}`, g?.updatedAt ?? now)).join("")}
    ${datasets.map((d) => urlEntry(`${env.CANONICAL_URL}/datasets/${d.cid}_${d.eid}`, d.modified)).join("")}
    </urlset>
  `;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59",
    },
  });
}
