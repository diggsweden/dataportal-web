import { getPublicationsList, populateSeo } from "@/utilities";
import { GetStaticProps } from "next/types";
import { ListPage } from "@/components/content/ListPage";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return await getPublicationsList([], ["Nyhet"], locale || "sv", {
    seo: {
      ...populateSeo,
      title: "Nyheter - Sveriges Dataportal",
      description: "Nyheter för Sveriges Dataportal",
    },
    basePath: `/nyheter`,
    heading: "Nyheter",
    heroImage: {
      __typename: "dataportal_Digg_Image",
      width: 1920,
      height: 400,
      url: "/images/newsHero.png",
      alt: "Nyheter",
      name: "newsHero.png",
      description: null,
      mime: "image/png",
      ext: null,
      screen9: null,
    },
  });
};

export default ListPage;
