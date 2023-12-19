"../../styles/general/emotion";
import { GetStaticPaths, GetStaticProps } from "next/types";
import { getPublication } from "../../utilities";
import Publication from "../aktuellt/[publication]";

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const slug = ("/" + params?.news) as string;
  return (await getPublication(slug, locale || "sv")) as any;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: any[] = [];

  return {
    paths,
    fallback: "blocking",
  };
};

export default Publication;
