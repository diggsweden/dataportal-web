import { GetStaticProps } from "next";

import { ListPage } from "@/features/pages/list-page";
import { getGoodExamplesList, populateSeo } from "@/utilities";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return await getGoodExamplesList(locale || "sv", {
    reuse: true,
    seo: {
      ...populateSeo,
      title: "Exempel på återanvändning av data",
      description:
        "Läs om hur olika dataanvändare har skapat nytta och innovation från data som har delats av offentliga aktörer.",
    },
    basePath: `/exempel-pa-ateranvandning`,
    heading: "Exempel på återanvändning av data",
    breadcrumb: "Exempel på återanvändning",
    preamble:
      "Läs om hur olika dataanvändare har skapat nytta och innovation från data som har delats av offentliga aktörer.",
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
