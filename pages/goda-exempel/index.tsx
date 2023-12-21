import { PublicationList } from "@/components/content/PublicationList";
import {
  getPublicationsList,
  populateSeo,
  PublicationListResponse,
} from "@/utilities";
import { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import Heading from "@/components/global/Typography/Heading";

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
      <Heading level={1} size={"lg"} className="mb-xl">
        {data.heading}
      </Heading>
      <PublicationList
        publications={data.publications}
        heading={data.heading}
      />
    </div>
  );
};

export default GoodExamplesList;
