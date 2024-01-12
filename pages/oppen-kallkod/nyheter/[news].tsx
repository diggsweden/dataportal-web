import { GetStaticPaths } from "next/types";
import { getPublication } from "@/utilities";
import { PublicationFull } from "@/components/content/Publication/PublicationFull";

export const getStaticProps = async ({ params, locale }: any) => {
  const slug = ("/" + params?.news) as string;
  return await getPublication(slug, locale || "sv", {
    domain: "oppen-kallkod",
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
