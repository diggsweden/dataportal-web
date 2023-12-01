import { ArticleListPage } from "../../components/pages/Articles";
import { getPublicationsList } from "../../utilities";

export async function getStaticProps({ locale }: any) {
  return await getPublicationsList([], [], locale || "sv");
}

export default ArticleListPage;
