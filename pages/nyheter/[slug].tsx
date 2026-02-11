import { GetStaticPaths, GetStaticProps } from "next/types";

import { PublicationFull } from "@/features/publication/publication-full";
import { getNewsItem } from "@/utilities";

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = `/${context.params?.slug}`;

  try {
    const result = await getNewsItem(slug, context.locale || "sv", {
      revalidate: true,
    });

    if ("notFound" in result) {
      // eslint-disable-next-line no-console
      console.warn(`[nyheter] Not found for slug: ${slug}, returning 404`);
      return { notFound: true as const };
    }

    // Ensure revalidate is always set to prevent stale data routes
    return {
      ...result,
      revalidate:
        result.revalidate || parseInt(process.env.REVALIDATE_INTERVAL || "60"),
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      `[nyheter] Error fetching news item for slug: ${slug}`,
      error,
    );
    return { notFound: true as const };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: string[] = [];

  return {
    paths,
    fallback: "blocking",
  };
};

export default PublicationFull;
