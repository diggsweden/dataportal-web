import { getPublicationsList, populateSeo } from "@/utilities";
import { GetStaticProps } from "next/types";
import { ListPage } from "@/components/content/ListPage";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return await getPublicationsList([], ["Nyhet"], locale || "sv", {
    seo: {
      ...populateSeo,
      title: "Nyheter - Sveriges Dataportal",
      description: "Nyheter relaterat till Data & API:er",
    },
    basePath: `/nyheter`,
    heading: "Nyheter",
  });
};

export default ListPage;
