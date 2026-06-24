import type http from "node:http";
import url from "node:url";

import fetchEnhanced from "fetch-enhanced";
import { HttpsProxyAgent } from "https-proxy-agent";
import nodeFetch from "node-fetch";

import { SettingsUtil } from "@/env";
import { CONTAINER_QUERY } from "@/graphql";
import type {
  ContainerDataFragment,
  ContainersQuery,
  ContainersQueryVariables,
  GoodExampleDataFragment,
  GoodExampleQuery,
  GoodExampleQueryVariables,
  NewsItemDataFragment,
  NewsItemQuery,
  NewsItemQueryVariables,
} from "@/graphql/__generated__/operations";
import { gqlFetch, logGqlError } from "@/graphql/fetcher";
import {
  GOOD_EXAMPLE_QUERY,
  NEWS_ITEM_QUERY,
} from "@/graphql/publicationQuery";
import { routing } from "@/i18n/routing";
import { includeLangInPath } from "@/utilities/check-lang";

/**
 * Generate at request time; caching is delegated to the CDN via
 * `Cache-Control: public, s-maxage=10, stale-while-revalidate=59`,
 * matching the legacy behaviour from `pages/sitemap.xml.tsx`.
 */
export const dynamic = "force-dynamic";

const proxyfetch = fetchEnhanced(nodeFetch);
const env = SettingsUtil.create();

type ContainerLike =
  | ContainerDataFragment
  | NewsItemDataFragment
  | GoodExampleDataFragment;

const slug = (c: ContainerLike | null): string => {
  if (!c) return "";
  const path = `${includeLangInPath(c.locale ?? routing.defaultLocale)}${c.slug ?? ""}`;
  if (c.__typename === "dataportal_Digg_News_Item") return `/nyheter${path}`;
  if (c.__typename === "dataportal_Digg_Good_Example") {
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
  const datasets = await getDatasets();

  const allContainers: (ContainerDataFragment | null)[] = [];
  const allNewsItems: (NewsItemDataFragment | null)[] = [];
  const allGoodExamples: (GoodExampleDataFragment | null)[] = [];

  // `routing.locales` is the source of truth post-Option B — the old
  // `getServerSideProps({ locales })` arg went silently undefined once
  // the Pages Router `i18n` block was removed, which had been quietly
  // producing an empty sitemap.
  await Promise.all(
    routing.locales.map(async (locale) => {
      try {
        const [containerResult, newsResult, goodExampleResult] =
          await Promise.all([
            gqlFetch<ContainersQuery, ContainersQueryVariables>(
              CONTAINER_QUERY,
              { filter: { locale, limit: 9999 } },
            ),
            gqlFetch<NewsItemQuery, NewsItemQueryVariables>(NEWS_ITEM_QUERY, {
              filter: { locale, limit: 9999 },
            }),
            gqlFetch<GoodExampleQuery, GoodExampleQueryVariables>(
              GOOD_EXAMPLE_QUERY,
              { filter: { locale, limit: 9999 } },
            ),
          ]);

        if (containerResult?.dataportal_Digg_Containers) {
          allContainers.push(...containerResult.dataportal_Digg_Containers);
        }
        if (newsResult?.dataportal_Digg_News_Items) {
          allNewsItems.push(...newsResult.dataportal_Digg_News_Items);
        }
        if (goodExampleResult?.dataportal_Digg_Good_Examples) {
          allGoodExamples.push(
            ...goodExampleResult.dataportal_Digg_Good_Examples,
          );
        }
      } catch (error) {
        logGqlError(error);
      }
    }),
  );

  // Localised slugs (`/statistik` vs `/en/statistics`) will move to
  // `next-intl` `pathnames` as each route family is ported. Until then
  // we emit both variants literally.
  const staticPaths = [
    "",
    "/datasets?datasets?p=1&q=&s=2&t=20&f=&rt=dataset%24data_service%24dataset_series",
    "/concepts?p=1&q=&s=2&t=20&f=&rt=term",
    "/specifications?specifications?p=1&q=&s=2&t=20&f=&rt=spec_standard%24spec_profile",
    "/statistik",
    "/en/statistics",
    "/metadatakvalitet",
  ];

  const now = new Date().toISOString();
  const urlEntry = (loc: string, lastmod: string): string => `
    <url>
        <loc>${loc}</loc>
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
