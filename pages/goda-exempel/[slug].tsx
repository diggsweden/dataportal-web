import { GetStaticPaths, GetStaticProps } from "next/types";

import { PublicationFull } from "@/features/publication/publication-full";
import { getGoodExample } from "@/utilities";

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const slug = ("/" + params?.slug) as string;
  return (await getGoodExample(slug, locale || "sv")) as any;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: any[] = [];

  return {
    paths,
    fallback: "blocking",
  };
};

export default PublicationFull;
