import React from "react";
import {
  ModuleListDataFragment,
  FaqFragment,
  ContainerDataFragment,
  NewsItemDataFragment,
  GoodExampleDataFragment,
  StartPageDataFragment,
} from "@/graphql/__generated__/operations";
import { ModuleDataFragment } from "@/graphql/__generated__/operations";
import { RelatedContentBlock } from "@/components/content/blocks/RelatedContentBlock";
import { TextBlock } from "@/components/content/blocks/TextBlock";
import { AccordionBlock } from "@/components/content/blocks/AccordionBlock";
import { MediaBlock } from "@/components/content/blocks/MediaBlock";
import { VideoBlock } from "@/components/content/blocks/VideoBlock";
import { FormPage } from "@/components/content/FormPage";
import { QuoteBlock } from "@/components/content/blocks/QuoteBlock";
import { PromotedContentBlock } from "@/components/content/blocks/PromotedContentBlock";
import { GridList } from "../../GridList";
import useTranslation from "next-translate/useTranslation";
interface blockListProps {
  blocks:
    | ContainerDataFragment["blocks"]
    | NewsItemDataFragment["blocks"]
    | GoodExampleDataFragment["blocks"]
    | ModuleDataFragment["blocks"]
    | StartPageDataFragment["blocks"];
  className?: string;
  landingPage?: boolean;
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

export const BlockList: React.FC<blockListProps> = ({
  blocks,
  className,
  landingPage,
}) => {
  const { t } = useTranslation();

  const getUniqueKey = (block: any, index: number) => {
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
              />
            );
          case "dataportal_Digg_ModuleList":
            const typedBlock = block as ModuleListDataFragment;
            return (
              typedBlock.modules &&
              typedBlock.modules.map((module) => (
                <BlockList {...module} key={module.identifier} />
              ))
            );
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
          default:
            return (
              <div key={getUniqueKey(block, index)}>
                <h2>
                  <>{(block as any)?.__typename} Not found</>
                </h2>
                <pre>{JSON.stringify(block, null, 2)}</pre>
              </div>
            );
        }
      })}
    </div>
  );
};
