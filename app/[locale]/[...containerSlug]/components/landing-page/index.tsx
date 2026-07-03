import { getTranslations } from "next-intl/server";

import { BlockList } from "@/components/blocks/block-list";
import { RelatedContentBlock } from "@/components/blocks/related-content-block";
import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import { Preamble } from "@/components/typography/preamble";
import type { ContainerDataFragment } from "@/graphql/__generated__/operations";
import type { AppLocale } from "@/i18n/routing";

import { ContainerBreadcrumb } from "../container-breadcrumb";

export interface LandingPageProps extends ContainerDataFragment {
  locale: AppLocale;
  pathname: string;
}

export const LandingPage = async (props: LandingPageProps) => {
  const { parent, image, heading, blocks, preamble, pathname, locale } =
    props || {};

  const t = await getTranslations({ locale });

  const topPromos =
    blocks &&
    blocks.length > 0 &&
    blocks[0].__typename === "dataportal_Digg_RelatedContent" &&
    blocks[0];
  const content = topPromos ? blocks.slice(1) : blocks;

  return (
    <Container>
      <ContainerBreadcrumb heading={heading} parent={parent} />
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

        {topPromos && <RelatedContentBlock {...topPromos} landingPage={true} />}

        <div className={"mb-xl"}>
          {content && <BlockList blocks={content} landingPage={true} />}
        </div>
      </div>
    </Container>
  );
};
