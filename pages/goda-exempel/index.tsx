import { getPublicationsList, populateSeo, renderImage } from "@/utilities";
import { GetStaticProps } from "next";
import { ListPage } from "@/components/content/ListPage";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return await getPublicationsList([], ["Goda exempel"], locale || "sv", {
    type: "PublicationList",
    seo: {
      ...populateSeo,
      title: "Goda exempel - Sveriges Dataportal",
      description: "Goda exempel på datadriven innovation i samhället.",
    },
    basePath: `/goda-exempel`,
    heading: "Goda exempel",
    preamble: "Goda exempel på datadriven innovation i samhället.",
    heroImage: renderImage({
      src: "/images/goodExamplesHero.png",
      width: 1700,
      height: 300,
    }),
  });
};

export default ListPage;
