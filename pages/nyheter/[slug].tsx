import { GetStaticPaths, GetStaticProps } from "next/types";

import { PublicationFull } from "@/features/publication/publication-full";
import { getNewsItem } from "@/utilities";

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = `/${context.params?.slug}`;
  const result = await getNewsItem(slug, context.locale || "sv");
  if ("notFound" in result) {
    return { notFound: true };
  }
  return result;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: string[] = [];

  return {
    paths,
    fallback: "blocking",
  };
};

export default PublicationFull;
