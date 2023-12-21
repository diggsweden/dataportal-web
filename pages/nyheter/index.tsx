import {
  getPublicationsList,
  populateSeo,
  PublicationListResponse,
} from "@/utilities";
import { GetStaticProps } from "next/types";
import { NextPage } from "next";
import { PublicationList } from "@/components/content/PublicationList";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return await getPublicationsList([], ["Nyhet"], locale || "sv", {
    seo: {
      ...populateSeo,
      title: "Nyheter",
    },
    basePath: `/nyheter`,
    heading: "Nyheter",
  });
};

const NewsList: NextPage<PublicationListResponse> = (data) => {
  const { t } = useTranslation();
  const metaTitle = t("pages|publications$social_meta_title");

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
      ;
    </div>
  );
};

export default NewsList;
