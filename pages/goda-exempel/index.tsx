import { getPublicationsList, populateSeo, renderImage } from "@/utilities";
import { GetStaticProps } from "next";
import { ListPage } from "@/components/content/ListPage";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return await getPublicationsList([], ["Goda exempel"], locale || "sv", {
    seo: {
      ...populateSeo,
      title: "Goda exempel - Sveriges Dataportal",
      description: "Inspirerande exempel relaterat till Data & API:er.",
    },
    basePath: `/goda-exempel`,
    heading: "Goda exempel",
    heroImage: renderImage({
      src: "/images/goodExamplesHero.png",
      width: 1700,
      height: 300,
    }),
  });
};

export default ListPage;
