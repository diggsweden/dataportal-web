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
    preamble: "Nyheter för Sveriges Dataportal",
    heroImage: {
      __typename: "dataportal_Digg_Image",
      url: "/images/newsHero.png",
      name: null,
      alt: null,
      description: null,
      mime: "image/png",
      ext: ".png",
      width: 1200,
      height: 300,
      screen9: { id: "" },
    },
  });
};

export default ListPage;
