import { getTranslations } from "next-intl/server";
import type React from "react";

import { BlockList } from "@/components/blocks/block-list";
import { Container } from "@/components/layout/container";
import { ContainerNav } from "@/components/navigation/container-nav";
import { BreadcrumbSetter } from "@/components/navigation/breadcrumbs/breadcrumb-setter";
import { Heading } from "@/components/typography/heading";
import { Preamble } from "@/components/typography/preamble";
import type { ContainerDataFragment } from "@/graphql/__generated__/operations";
import type { Breadcrumb } from "@/types/global";
import { checkLang, linkBase } from "@/utilities";

import { AnchorNavigation } from "./anchor-navigation";
import { CodeHighlighter } from "./code-highlighter";

interface ContainerPageProps extends ContainerDataFragment {
  related?: ContainerDataFragment[];
}

export const ContainerPage: React.FC<ContainerPageProps> = async ({
  heading,
  image,
  preamble,
  blocks,
  related,
  parent,
}) => {
  const t = await getTranslations();

  const formPage = blocks?.find(
    (block) => block.__typename === "dataportal_Digg_FoertroendemodellenBlock",
  );
  const hasRelatedContent = related && related.length > 1;

  const crumbs: Breadcrumb[] = [
    { name: "start", link: { ...linkBase, link: "/" } },
  ];
  if (parent && parent.heading && parent.slug) {
    crumbs.push({
      name: parent.heading,
      link: { ...linkBase, link: parent.slug },
    });
  }

  return (
    <Container>
      <BreadcrumbSetter name={heading} crumbs={crumbs} />
      <CodeHighlighter />
      <article className="flex w-full flex-col gap-md lg:gap-xl xl:flex-row">
        {hasRelatedContent && <ContainerNav related={related} />}
        <div className="flex w-full flex-col">
          {!image && heading && (
            <Heading
              size={"lg"}
              level={1}
              className={`mb-lg md:mb-xl ${
                hasRelatedContent ? "xl:col-start-2 xl:mb-xl" : ""
              }`}
            >
              {checkLang(heading)}
            </Heading>
          )}
          <div className="flex w-full flex-col items-start justify-end gap-xl lg:flex-row-reverse">
            <AnchorNavigation
              menuHeading={t("common.content-menu-heading")}
            />

            <div
              id="content"
              aria-label="Main content"
              className={`${
                formPage
                  ? "w-full"
                  : "flex w-full max-w-md flex-col space-y-lg md:space-y-xl lg:min-w-[620px]"
              }`}
            >
              {!image && preamble && <Preamble>{checkLang(preamble)}</Preamble>}
              {blocks && blocks.length > 0 && <BlockList blocks={blocks} />}
            </div>
          </div>
        </div>
      </article>
    </Container>
  );
};
