import useTranslation from "next-translate/useTranslation";
import { FC } from "react";

import { AccordionBlock } from "@/components/blocks/accordion-block";
import { MediaBlock } from "@/components/blocks/media-block";
import { PromotedContentBlock } from "@/components/blocks/promoted-content-block";
import { QuoteBlock } from "@/components/blocks/quote-block";
import { RelatedContentBlock } from "@/components/blocks/related-content-block";
import { TextBlock } from "@/components/blocks/text-block";
import { VideoBlock } from "@/components/blocks/video-block";
import { GridList } from "@/components/grid-list";
import { FormPage } from "@/features/pages/form-page";
import {
  ModuleDataFragment,
  ModuleListDataFragment,
  FaqFragment,
  ContainerDataFragment,
  NewsItemDataFragment,
  GoodExampleDataFragment,
  StartPageDataFragment,
  BlockDataFragment,
} from "@/graphql/__generated__/operations";

import { CtaCardBlock } from "../cta-card-block";
import { FortroendemodellenFrom } from "../fortroendemodellen-v2";
interface blockListProps {
  blocks:
    | ContainerDataFragment["blocks"]
    | NewsItemDataFragment["blocks"]
    | GoodExampleDataFragment["blocks"]
    | ModuleDataFragment["blocks"]
    | StartPageDataFragment["blocks"];
  className?: string;
  landingPage?: boolean;
  formPage?: boolean;
}

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
  const faqGroup = blocks.slice(pos, pos + i);

  return (
    <ul
      className="max-w-md divide-y divide-brown-200 border-y border-brown-200"
      key={`content-${pos}-${faqGroup[0].id}`}
    >
      {faqGroup.map((faq, idx: number) => (
        <li key={idx} className="px-xs">
          <AccordionBlock {...(faq as FaqFragment)} idx={idx} />
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
  const { t } = useTranslation();

  const getUniqueKey = (block: BlockDataFragment, index: number) => {
    const blockId = block?.id || "";
    const blockType = block?.__typename || "";
    return `block-${blockType}-${blockId}-${index}`;
  };

  return (
    <div
      className={`mb-lg space-y-xl md:mb-xl md:space-y-xl ${
        className ? className : ""
      }`}
    >
      {blocks?.map((block, index) => {
        if (block == null) {
          return;
        }

        switch (block.__typename) {
          case "dataportal_Digg_Text":
            return <TextBlock {...block} key={getUniqueKey(block, index)} />;
          case "dataportal_Digg_Quote":
            return <QuoteBlock {...block} key={getUniqueKey(block, index)} />;
          case "dataportal_Digg_Media":
            return <MediaBlock {...block} key={getUniqueKey(block, index)} />;
          case "dataportal_Digg_Video":
            return <VideoBlock {...block} key={getUniqueKey(block, index)} />;
          case "dataportal_Digg_PromotedContent":
            return (
              <PromotedContentBlock
                {...block}
                key={getUniqueKey(block, index)}
              />
            );
          case "dataportal_Digg_Faq":
            return handleFaqs(blocks, index);
          case "dataportal_Digg_RelatedContent":
            return (
              <RelatedContentBlock
                {...block}
                key={getUniqueKey(block, index)}
                landingPage={landingPage}
                formPage={formPage}
              />
            );
          case "dataportal_Digg_ModuleList": {
            const typedBlock = block as ModuleListDataFragment;
            return (
              typedBlock.modules &&
              typedBlock.modules.map((module) => (
                <BlockList {...module} key={module.identifier} />
              ))
            );
          }
          case "dataportal_Digg_FormBlock":
            return (
              <FormPage
                key={getUniqueKey(block, index)}
                elements={block.elements}
                id={block.id}
                identifier={block.id}
                __typename="dataportal_Digg_Form"
              />
            );
          case "dataportal_Digg_NewsBlock":
            return (
              <GridList
                key={getUniqueKey(block, index)}
                className="!my-xl md:!my-2xl"
                items={block.items}
                showMoreLink={{
                  title: t("pages|news$view-all"),
                  slug: t("routes|news$path"),
                }}
                heading={block.heading || t("pages|startpage$news")}
              />
            );
          case "dataportal_Digg_GoodExampleBlock":
            return (
              <GridList
                key={getUniqueKey(block, index)}
                className="!my-xl md:!my-2xl"
                items={block.items}
                showMoreLink={{
                  title: t("pages|good-examples$view-all"),
                  slug: t("routes|good-examples$path"),
                }}
                heading={block.heading || t("pages|startpage$good-examples")}
              />
            );
          case "dataportal_Digg_CTACardBlock":
            return <CtaCardBlock {...block} key={getUniqueKey(block, index)} />;
          case "dataportal_Digg_FoertroendemodellenBlock":
            return <FortroendemodellenFrom key={getUniqueKey(block, index)} />;
          default: {
            const unknownBlock = block as { __typename: string; id: string };
            return (
              <div key={unknownBlock.id}>
                <h2>
                  <>{unknownBlock.__typename} Not found</>
                </h2>
                <pre>{JSON.stringify(unknownBlock, null, 2)}</pre>
              </div>
            );
          }
        }
      })}
    </div>
  );
};
