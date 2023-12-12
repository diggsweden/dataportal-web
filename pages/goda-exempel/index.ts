import { ArticleListPage } from "../../components/pages/Articles";
import { getPublicationsList, populateSeo } from "../../utilities";

export async function getStaticProps({ locale }: any) {
  return await getPublicationsList([], ["Goda exempel"], locale || "sv", {
    seo: {
      ...populateSeo,
      title: "Goda exempel",
    },
    basePath: `/goda-exempel`,
    heading: "Goda exempel",
  });
}

export default ArticleListPage;
