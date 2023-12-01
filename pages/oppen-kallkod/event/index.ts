import { getPublicationsList, populateSeo } from "../../../utilities";
import ArticleListPage from "../../aktuellt";

export async function getStaticProps({ locale }: any) {
  return await getPublicationsList(
    ["oppen-kallkod"],
    ["Event"],
    locale || "sv",
    {
      seo: {
        ...populateSeo,
        title: "Öppen källkod - Evenemang",
        description: "Evenemang relaterat till öppen källkod",
      },
      basePath: `/oppen-kallkod/event`,
      heading: "Evenemang",
    },
  );
}

export default ArticleListPage;
