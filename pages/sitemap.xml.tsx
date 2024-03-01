import { GetServerSideProps } from "next/types";
import { client, CONTAINER_QUERY } from "../graphql";
import { PUBLICATION_QUERY } from "../graphql/publicationQuery";
import {
  ContainerData_Dataportal_Digg_Container_Fragment,
  ContainersQuery,
  ContainersQueryVariables,
  PublicationDataFragment,
  PublicationQuery,
  PublicationQueryVariables,
} from "../graphql/__generated__/operations";
import { SettingsUtil } from "../env";
import { HttpsProxyAgent } from "https-proxy-agent";
import nodeFetch from "node-fetch";
import fetchEnhanced from "fetch-enhanced";
import url from "url";

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
 * @param container
 * @returns true if container is dataportal_Digg_Publication
 */
const isPublication = (
  container:
    | ContainerData_Dataportal_Digg_Container_Fragment
    | PublicationDataFragment
    | null,
): container is PublicationDataFragment => {
  return container?.__typename === "dataportal_Digg_Publication";
};

/**
 * Prepends paths based on locale and containerType
 * @param c
 * @returns a correctly formatted slug
 */
const slug = (
  c:
    | ContainerData_Dataportal_Digg_Container_Fragment
    | PublicationDataFragment
    | null,
) => {
  const slug = c?.locale === "sv" ? c?.slug : `/${c?.locale}${c?.slug}`;
  if (isPublication(c)) {
    return `/aktuellt${slug}`;
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
    let proxy_uri = url.parse(proxy_url);

    //add auth to proxy if set in env
    if (proxy_user && proxy_pass) {
      proxy_uri.auth = `${proxy_user}:${proxy_pass}`;
    }

    let proxy = new HttpsProxyAgent(proxy_uri);

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

/**
 * Generates a sitemap based on backend data
 * @returns a sitemap in xml format
 */
export const getServerSideProps: GetServerSideProps = async ({
  res,
  locales,
}) => {
  const datasets: any[] = await getDatasets();

  const allContainers: (ContainerData_Dataportal_Digg_Container_Fragment | null)[] =
    [];

  const allPublications: (PublicationDataFragment | null)[] = [];

  locales &&
    (await Promise.all(
      // Get all containers in all locales
      locales.map(async (locale) => {
        // Get external data from the file system, API, DB, etc.
        const containerResult = await client.query<
          ContainersQuery,
          ContainersQueryVariables
        >({
          query: CONTAINER_QUERY,
          variables: { filter: { locale, limit: 9999 } },
        });

        const publicationResult = await client.query<
          PublicationQuery,
          PublicationQueryVariables
        >({
          query: PUBLICATION_QUERY,
          variables: { filter: { locale, limit: 9999 } },
        });

        const containers = containerResult?.data?.dataportal_Digg_Containers;
        const publications =
          publicationResult?.data?.dataportal_Digg_Publications;

        if (containerResult?.error) {
          console.error(containerResult?.error);
        }
        if (publicationResult?.error) {
          console.error(publicationResult.error);
        }

        containers && allContainers.push(...containers);
        publications && allPublications.push(...publications);
      }),
    ));

  const staticPaths = [
    "",
    "/datasets?p=1&amp;q=&amp;s=2&amp;t=20&amp;f=&amp;rt=dataset%24esterms_IndependentDataService%24esterms_ServedByDataService&amp;c=false",
    "/concepts?p=1&amp;q=&amp;s=2&amp;t=20&amp;f=&amp;rt=term&amp;c=false",
    "/specifications?p=1&amp;q=&amp;s=2&amp;t=20&amp;f=&amp;rt=spec_standard%24spec_profile&amp;c=false",
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
      Array.isArray(allPublications) &&
      allPublications
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
