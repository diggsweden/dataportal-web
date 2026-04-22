import url from "url";

import fetchEnhanced from "fetch-enhanced";
import { HttpsProxyAgent } from "https-proxy-agent";
import nodeFetch from "node-fetch";

import { SettingsUtil } from "@/env";
import { client, CONTAINER_QUERY } from "@/graphql";
import {
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
import {
  GOOD_EXAMPLE_QUERY,
  NEWS_ITEM_QUERY,
} from "@/graphql/publicationQuery";

const proxyfetch = fetchEnhanced(nodeFetch);

const env = SettingsUtil.create();

/**
 * Prepends paths based on locale and containerType
 */
const slug = (
  c:
    | ContainerDataFragment
    | NewsItemDataFragment
    | GoodExampleDataFragment
    | null,
) => {
  const s = c?.locale === "sv" ? c?.slug : `/${c?.locale}${c?.slug}`;
  if (c?.__typename === "dataportal_Digg_News_Item") {
    return `/nyheter${s}`;
  } else if (c?.__typename === "dataportal_Digg_Good_Example") {
    return `/exempel-datadriven-transformation${s}`;
  } else {
    return s;
  }
};

/**
 * Fetch all datasets from MetaSolutions sitemap of all resources
 */
const getDatasets = async () => {
  const proxy_url = process.env.HTTP_PROXY || "";
  const proxy_user = process.env.HTTP_PROXY_USER;
  const proxy_pass = process.env.HTTP_PROXY_PASS;

  if (proxy_url && proxy_url.length > 0) {
    const proxy_uri = url.parse(proxy_url);

    if (proxy_user && proxy_pass) {
      proxy_uri.auth = `${proxy_user}:${proxy_pass}`;
    }

    const proxy = new HttpsProxyAgent(proxy_uri);

    const response = await proxyfetch(env.ENTRYSCAPE_SITEMAP_JSON_URL, {
      agent: proxy,
    });

    if (response.ok && response.status === 200) {
      const data = await response.json();
      return data;
    } else {
      console.error({ message: "proxy fetch error", response });
      return [];
    }
  } else {
    const response = await fetch(env.ENTRYSCAPE_SITEMAP_JSON_URL);

    if (response.ok && response.status === 200) {
      const data = await response.json();
      return data;
    } else {
      return [];
    }
  }
};

export const dynamic = "force-dynamic";

export async function GET() {
  const locales = ["sv", "en"];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const datasets: any[] = await getDatasets();

  const allContainers: (ContainerDataFragment | null)[] = [];
  const allNewsItems: (NewsItemDataFragment | null)[] = [];
  const allGoodExamples: (GoodExampleDataFragment | null)[] = [];

  await Promise.all(
    locales.map(async (locale) => {
      const containerResult = await client.query<
        ContainersQuery,
        ContainersQueryVariables
      >({
        query: CONTAINER_QUERY,
        variables: { filter: { locale, limit: 9999 } },
      });

      const newsResult = await client.query<
        NewsItemQuery,
        NewsItemQueryVariables
      >({
        query: NEWS_ITEM_QUERY,
        variables: { filter: { locale, limit: 9999 } },
      });

      const goodExampleResult = await client.query<
        GoodExampleQuery,
        GoodExampleQueryVariables
      >({
        query: GOOD_EXAMPLE_QUERY,
        variables: { filter: { locale, limit: 9999 } },
      });

      const containers = containerResult?.data?.dataportal_Digg_Containers;
      const news = newsResult?.data?.dataportal_Digg_News_Items;
      const goodExamples =
        goodExampleResult?.data?.dataportal_Digg_Good_Examples;

      if (containerResult?.error) {
        console.error(containerResult?.error);
      }
      if (newsResult?.error) {
        console.error(newsResult.error);
      }
      if (goodExampleResult?.error) {
        console.error(goodExampleResult.error);
      }

      if (containers) {
        allContainers.push(...containers);
      }
      if (news) {
        allNewsItems.push(...news);
      }
      if (goodExamples) {
        allGoodExamples.push(...goodExamples);
      }
    }),
  );

  const staticPaths = [
    "",
    "/datasets?datasets?p=1&q=&s=2&t=20&f=&rt=dataset%24data_service%24dataset_series",
    "/concepts?p=1&q=&s=2&t=20&f=&rt=term",
    "/specifications?specifications?p=1&q=&s=2&t=20&f=&rt=spec_standard%24spec_profile",
    "/statistik",
    "/en/statistics",
    "/metadatakvalitet",
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${
      Array.isArray(staticPaths) &&
      staticPaths
        .map((path) => {
          return `
        <url>
            <loc>${env.CANONICAL_URL}${path}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1.0</priority>
        </url>
    `;
        })
        .join("")
    }
    ${
      Array.isArray(allContainers) &&
      allContainers
        .map((c) => {
          return `
        <url>
            <loc>${env.CANONICAL_URL}${slug(c)}</loc>
            <lastmod>${c?.updatedAt}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1.0</priority>
        </url>
    `;
        })
        .join("")
    }
    ${
      Array.isArray(allNewsItems) &&
      allNewsItems
        .map((n) => {
          return `
        <url>
            <loc>${env.CANONICAL_URL}${slug(n)}</loc>
            <lastmod>${n?.updatedAt}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1.0</priority>
        </url>
    `;
        })
        .join("")
    }
    ${
      Array.isArray(allGoodExamples) &&
      allGoodExamples
        .map((g) => {
          return `
        <url>
            <loc>${env.CANONICAL_URL}${slug(g)}</loc>
            <lastmod>${g?.updatedAt}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1.0</priority>
        </url>
    `;
        })
        .join("")
    }
    ${
      Array.isArray(datasets) &&
      datasets
        .map((d) => {
          return `
        <url>
            <loc>${env.CANONICAL_URL}/datasets/${d.cid}_${d.eid}</loc>
            <lastmod>${d.modified}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1.0</priority>
        </url>
    `;
        })
        .join("")
    }
    </urlset>
  `;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "text/xml",
      "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59",
    },
  });
}
