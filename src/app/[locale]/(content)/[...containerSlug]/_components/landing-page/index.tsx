import { getTranslations } from "next-intl/server";

import { BlockList } from "@/components/blocks/block-list";
import { RelatedContentBlock } from "@/components/blocks/related-content-block";
import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import { Preamble } from "@/components/typography/preamble";
import { BlockDataFragment } from "@/graphql/fragments";
import { type FragmentType, getFragmentData } from "@/graphql/gql";
import type { ContainerDataFragment } from "@/graphql/gql/graphql";
import type { AppLocale } from "@/i18n/routing";

export interface LandingPageProps extends ContainerDataFragment {
  locale: AppLocale;
  pathname: string;
}

export const LandingPage = async (props: LandingPageProps) => {
  const { image, heading, blocks, preamble, pathname, locale } = props || {};

  const t = await getTranslations({ locale });

  const firstBlock =
    blocks && blocks.length > 0
      ? getFragmentData(
          BlockDataFragment,
          blocks[0] as FragmentType<typeof BlockDataFragment>,
        )
      : null;
  const topPromos =
    firstBlock?.__typename === "dataportal_Digg_RelatedContent"
      ? firstBlock
      : null;
  const content = topPromos ? blocks.slice(1) : blocks;

  return (
    <Container>
      <div id="LandingPage" className="space-y-md lg:space-y-xl">
        {!image && heading && (
          <Heading level={1} size="lg" className="mb-lg md:mb-xl">
            {heading}
          </Heading>
        )}

        {pathname === `/${t("routes.search-api.path")}` ||
        (!image && preamble) ? (
          <Preamble className="max-w-md">{preamble}</Preamble>
        ) : null}

        {topPromos && (
          <RelatedContentBlock block={topPromos} landingPage={true} />
        )}

        <div className={"mb-xl"}>
          {content && <BlockList blocks={content} landingPage={true} />}
        </div>
      </div>
    </Container>
  );
};
