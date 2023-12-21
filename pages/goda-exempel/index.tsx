import { PublicationList } from "@/components/content/PublicationList";
import {
  getPublicationsList,
  populateSeo,
  PublicationListResponse,
} from "@/utilities";
import { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";

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

const GoodExamplesList: NextPage<PublicationListResponse> = (data) => {
  const { t } = useTranslation();
  const metaTitle = t("pages|good-examples$social_meta_title");

  return (
    <div id="news-list">
      <Head>
        <title>{metaTitle}</title>
        <meta property="og:title" content={metaTitle} />
      </Head>
      <PublicationList
        publications={data.publications}
        heading={data.heading}
      />
    </div>
  );
};

export default GoodExamplesList;
