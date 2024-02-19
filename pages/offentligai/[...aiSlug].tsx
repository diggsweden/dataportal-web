import { GetStaticPaths, GetStaticProps } from "next/types";
import { getMultiContainer } from "@/utilities";
import { Page } from "../[...containerSlug]";

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const slugs = params?.aiSlug as Array<string>;
  return (await getMultiContainer(slugs, locale || "sv", "offentligai")) as any;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: any[] = [];

  return {
    paths,
    fallback: "blocking",
  };
};

export default Page;
