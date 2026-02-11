import { GetStaticPaths, GetStaticProps } from "next/types";

import { PublicationFull } from "@/features/publication/publication-full";
import { getGoodExample } from "@/utilities";

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = `/${context.params?.slug}`;
  const reuse = false;

  try {
    const result = await getGoodExample(
      slug,
      context.locale || "sv",
      { revalidate: true },
      reuse,
    );

    if ("notFound" in result) {
      // eslint-disable-next-line no-console
      console.warn(`[goda-exempel] Not found for slug: ${slug}, returning 404`);
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
      `[goda-exempel] Error fetching good example for slug: ${slug}`,
      error,
    );
    // Return 404 on error to prevent crashes, but log for debugging
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
