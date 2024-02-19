import { getPublicationsList, populateSeo } from "@/utilities";
import { GetStaticProps } from "next";
import { ListPage } from "@/components/content/ListPage";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return await getPublicationsList([], ["Goda exempel"], locale || "sv", {
    seo: {
      ...populateSeo,
      title: "Goda exempel - Sveriges Dataportal",
      description: "Goda exempel på datadriven innovation i samhället.",
    },
    basePath: `/goda-exempel`,
    heading: "Goda exempel",
    preamble: "Goda exempel på datadriven innovation i samhället.",
    heroImage: {
      __typename: "dataportal_Digg_Image",
      url: "/images/goodExamplesHero.png",
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
