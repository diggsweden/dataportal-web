import { GetStaticPaths } from "next/types";
import { PublicationFull } from "@/components/content/Publication/PublicationFull";
import { getPublication } from "@/utilities";

export const getStaticProps = async ({ params, locale }: any) => {
  const slug = ("/" + params?.event) as string;
  return await getPublication(slug, locale || "sv", {
    domain: "data",
    revalidate: true,
  });
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: any[] = [];

  return {
    paths,
    fallback: "blocking",
  };
};

export default PublicationFull;
