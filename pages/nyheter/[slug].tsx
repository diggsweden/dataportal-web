import { GetStaticPaths, GetStaticProps } from "next/types";
import { getNewsItem } from "@/utilities";
import { PublicationFull } from "@/features/publication/publication-full";

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const slug = ("/" + params?.slug) as string;
  return (await getNewsItem(slug, locale || "sv")) as any;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: any[] = [];

  return {
    paths,
    fallback: "blocking",
  };
};

export default PublicationFull;
