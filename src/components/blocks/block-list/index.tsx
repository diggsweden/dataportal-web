import { useTranslations } from "next-intl";
import type { FC } from "react";

import {
  AccordionBlock,
  type FaqFragment,
} from "@/components/blocks/accordion-block";
import { MediaBlock } from "@/components/blocks/media-block";
import { PromotedContentBlock } from "@/components/blocks/promoted-content-block";
import { QuoteBlock } from "@/components/blocks/quote-block";
import { RelatedContentBlock } from "@/components/blocks/related-content-block";
import { TextBlock } from "@/components/blocks/text-block";
import { VideoBlock } from "@/components/blocks/video-block";
import { FormPage } from "@/components/form/form-page";
import { GridList } from "@/components/grid-list";
import { Teaser } from "@/components/teaser";
import {
  BlockDataFragment,
  FormBlockFragment,
  GoodExampleBlockFragment,
  GoodExampleBlockItemFragment,
  ModuleDataFragment,
  ModuleListDataFragment,
  NewsBlockFragment,
  NewsBlockItemFragment,
} from "@/graphql/fragments";
import { type FragmentType, getFragmentData } from "@/graphql/gql";
import type {
  ContainerDataFragment,
  GoodExampleDataFragment,
  ModuleDataFragment as ModuleDataType,
  NewsItemDataFragment,
  StartPageDataFragment,
} from "@/graphql/gql/graphql";

import { CtaCardBlock } from "../cta-card-block";
import { FortroendemodellenFrom } from "../fortroendemodellen-v2";

interface blockListProps {
  blocks:
    | ContainerDataFragment["blocks"]
    | NewsItemDataFragment["blocks"]
    | GoodExampleDataFragment["blocks"]
    | ModuleDataType["blocks"]
    | StartPageDataFragment["blocks"];
  className?: string;
  landingPage?: boolean;
  formPage?: boolean;
}

type MaskedBlock = FragmentType<typeof BlockDataFragment>;

/**
 * Finds grouped accordions and returns them
 * @param blocks all blocks from the content area
 * @param pos the position of the FAQ
 * @returns FaqBlocks wrapped in <dl> element
 */
const handleFaqs = (blocks: blockListProps["blocks"], pos: number) => {
  // skip rendering if previous block was FAQ
  // because then in should already be rendered
  const previousBlock = blocks[pos - 1];
  if (previousBlock?.__typename === "dataportal_Digg_Faq") return;

  let i = 0;
  // count the number of FAQs to render from the given position
  while (blocks[pos + i]?.__typename === "dataportal_Digg_Faq" || i > 500) {
    i++;
  }

  // make a copy of the FAQ range to render
  const faqGroup = blocks
    .slice(pos, pos + i)
    .map((faq) =>
      getFragmentData(
        BlockDataFragment,
        faq as FragmentType<typeof BlockDataFragment>,
      ),
    );

  return (
    <ul
      className="max-w-md divide-y divide-brown-200 border-y border-brown-200"
      key={`content-${pos}-${faqGroup[0].id}`}
    >
      {faqGroup.map((faq, idx: number) => (
        <li key={faq.id} className="px-xs">
          <AccordionBlock
            block={faq as unknown as FragmentType<typeof FaqFragment>}
            idx={idx}
          />
        </li>
      ))}
    </ul>
  );
};

export const BlockList: FC<blockListProps> = ({
  blocks,
  className,
  landingPage,
  formPage,
}) => {
  const t = useTranslations();

  return (
    <div
      className={`mb-lg space-y-xl md:mb-xl md:space-y-xl ${
        className ? className : ""
      }`}
    >
      {blocks?.map((rawBlock, index) => {
        if (rawBlock == null) {
          return null;
        }

        const block = getFragmentData(
          BlockDataFragment,
          rawBlock as MaskedBlock,
        );
        const key = `block-${block.__typename}-${block.id}-${index}`;

        switch (block.__typename) {
          case "dataportal_Digg_Text":
            return <TextBlock block={block} key={key} />;
          case "dataportal_Digg_Quote":
            return <QuoteBlock block={block} key={key} />;
          case "dataportal_Digg_Media":
            return <MediaBlock block={block} key={key} />;
          case "dataportal_Digg_Video":
            return <VideoBlock block={block} key={key} />;
          case "dataportal_Digg_PromotedContent":
            return <PromotedContentBlock block={block} key={key} />;
          case "dataportal_Digg_Faq":
            return handleFaqs(blocks, index);
          case "dataportal_Digg_RelatedContent":
            return (
              <RelatedContentBlock
                block={block}
                key={key}
                landingPage={landingPage}
                formPage={formPage}
              />
            );
          case "dataportal_Digg_ModuleList": {
            const { modules } = getFragmentData(
              ModuleListDataFragment,
              rawBlock as FragmentType<typeof ModuleListDataFragment>,
            );
            return (
              modules.length > 0 &&
              modules.map((module) => {
                const { identifier, blocks: moduleBlocks } = getFragmentData(
                  ModuleDataFragment,
                  module,
                );
                return <BlockList blocks={moduleBlocks} key={identifier} />;
              })
            );
          }
          case "dataportal_Digg_FormBlock": {
            const { elements } = getFragmentData(FormBlockFragment, block);
            return (
              <FormPage
                key={key}
                elements={elements}
                id={block.id}
                identifier={block.id}
                __typename="dataportal_Digg_Form"
              />
            );
          }
          case "dataportal_Digg_NewsBlock": {
            const { heading, items } = getFragmentData(
              NewsBlockFragment,
              block,
            );
            return (
              <GridList
                key={key}
                className="!my-xl md:!my-2xl"
                items={getFragmentData(NewsBlockItemFragment, items)}
                renderItem={(item) => <Teaser item={item} />}
                getItemKey={(item) => item.slug}
                showMoreLink={{
                  title: t("pages.news.view-all"),
                  slug: t("routes.news.path"),
                }}
                heading={heading || t("pages.startpage.news")}
              />
            );
          }
          case "dataportal_Digg_GoodExampleBlock": {
            const { heading, items } = getFragmentData(
              GoodExampleBlockFragment,
              block,
            );
            return (
              <GridList
                key={key}
                className="!my-xl md:!my-2xl"
                items={getFragmentData(GoodExampleBlockItemFragment, items)}
                renderItem={(item) => <Teaser item={item} />}
                getItemKey={(item) => item.slug}
                showMoreLink={{
                  title: t("pages.good-examples.view-all"),
                  slug: t("routes.good-examples.path"),
                }}
                heading={heading || t("pages.startpage.good-examples")}
              />
            );
          }
          case "dataportal_Digg_CTACardBlock":
            return <CtaCardBlock block={block} key={key} />;
          case "dataportal_Digg_FoertroendemodellenBlock":
            return <FortroendemodellenFrom key={key} />;
          default: {
            const unknownBlock = block as { __typename: string; id: string };
            return (
              <div key={unknownBlock.id}>
                <h2>{unknownBlock.__typename} Not found</h2>
                <pre>{JSON.stringify(unknownBlock, null, 2)}</pre>
              </div>
            );
          }
        }
      })}
    </div>
  );
};
