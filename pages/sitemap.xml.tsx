import fetchEnhanced from "fetch-enhanced";
import type http from "http";
import { HttpsProxyAgent } from "https-proxy-agent";
import type { GetServerSideProps } from "next/types";
import nodeFetch from "node-fetch";
import url from "url";

import { SettingsUtil } from "../env";
import { CONTAINER_QUERY } from "../graphql";
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
} from "../graphql/__generated__/operations";
import { gqlFetch, logGqlError } from "../graphql/fetcher";
import {
  GOOD_EXAMPLE_QUERY,
  NEWS_ITEM_QUERY,
} from "../graphql/publicationQuery";

const proxyfetch = fetchEnhanced(nodeFetch);

const env = SettingsUtil.create();

/**
 * return null for the react component, rendering will be handled
 * in the getServersideProps method
 * @returns null
 */
const Sitemap = () => {
  return null;
};

/**
 * Prepends paths based on locale and containerType
 * @param c
 * @returns a correctly formatted slug
 */
const slug = (
  c:
    | ContainerDataFragment
    | NewsItemDataFragment
    | GoodExampleDataFragment
    | null,
) => {
  const slug = c?.locale === "sv" ? c?.slug : `/${c?.locale}${c?.slug}`;
  if (c?.__typename === "dataportal_Digg_News_Item") {
    return `/nyheter${slug}`;
  } else if (c?.__typename === "dataportal_Digg_Good_Example") {
    return `/exempel-datadriven-transformation${slug}`;
  } else {
    return slug;
  }
};

/**
 * Fetch all datasets from MetaSolutions sitemap of all resources
 * @returns array of sitemap-object
 */
const getDatasets = async () => {
  //check for proxy config
  const proxy_url = process.env.HTTP_PROXY || "";
  const proxy_user = process.env.HTTP_PROXY_USER;
  const proxy_pass = process.env.HTTP_PROXY_PASS;

  if (proxy_url && proxy_url.length > 0) {
    const proxy_uri = url.parse(proxy_url);

    //add auth to proxy if set in env
    if (proxy_user && proxy_pass) {
      proxy_uri.auth = `${proxy_user}:${proxy_pass}`;
    }

    const proxy = new HttpsProxyAgent(proxy_uri);

    const response = await proxyfetch(env.ENTRYSCAPE_SITEMAP_JSON_URL, {
      // `https-proxy-agent@5` does not implement the newer http.Agent surface
      // expected by `@types/node@20`. This path is being rewritten in Phase 4.
      agent: proxy as unknown as http.Agent,
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

/**
 * Generates a sitemap based on backend data
 * @returns a sitemap in xml format
 */
export const getServerSideProps: GetServerSideProps = async ({
  res,
  locales,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const datasets: any[] = await getDatasets();

  const allContainers: (ContainerDataFragment | null)[] = [];

  const allNewsItems: (NewsItemDataFragment | null)[] = [];

  const allGoodExamples: (GoodExampleDataFragment | null)[] = [];

  if (locales) {
    await Promise.all(
      locales.map(async (locale) => {
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

          const containers = containerResult?.dataportal_Digg_Containers;
          const news = newsResult?.dataportal_Digg_News_Items;
          const goodExamples = goodExampleResult?.dataportal_Digg_Good_Examples;

          if (containers) {
            allContainers.push(...containers);
          }
          if (news) {
            allNewsItems.push(...news);
          }
          if (goodExamples) {
            allGoodExamples.push(...goodExamples);
          }
        } catch (error) {
          logGqlError(error);
        }
      }),
    );
  }

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

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59",
  );
  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
