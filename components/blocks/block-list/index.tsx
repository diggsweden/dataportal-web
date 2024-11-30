import React from "react";

import { AccordionBlock } from "@/components/blocks/accordion-block";
import { MediaBlock } from "@/components/blocks/media-block";
import { PromotedContentBlock } from "@/components/blocks/promoted-content-block";
import { QuoteBlock } from "@/components/blocks/quote-block";
import { RelatedContentBlock } from "@/components/blocks/related-content-block";
import { TextBlock } from "@/components/blocks/text-block";
import { VideoBlock } from "@/components/blocks/video-block";
import { FormPage } from "@/features/pages/form-page";
import {
  ModuleDataFragment,
  ModuleListDataFragment,
  FaqFragment,
  ContainerDataFragment,
  NewsItemDataFragment,
  GoodExampleDataFragment,
} from "@/graphql/__generated__/operations";

interface blockListProps {
  blocks:
    | ContainerDataFragment["blocks"]
    | NewsItemDataFragment["blocks"]
    | GoodExampleDataFragment["blocks"]
    | ModuleDataFragment["blocks"];
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
        const { id } = block || {};

        switch (block.__typename) {
          case "dataportal_Digg_Text":
            return <TextBlock {...block} key={`${id}-${index}`} />;
          case "dataportal_Digg_Quote":
            return <QuoteBlock {...block} key={`${id}-${index}`} />;
          case "dataportal_Digg_Media":
            return <MediaBlock {...block} key={`${id}-${index}`} />;
          case "dataportal_Digg_Video":
            return <VideoBlock {...block} key={`${id}-${index}`} />;
          case "dataportal_Digg_PromotedContent":
            return <PromotedContentBlock {...block} key={`${id}-${index}`} />;
          case "dataportal_Digg_Faq":
            return handleFaqs(blocks, index);
          case "dataportal_Digg_RelatedContent":
            return (
              <RelatedContentBlock
                {...block}
                key={`${id}-${index}`}
                landingPage={landingPage}
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
                key={block.id}
                elements={block.elements}
                id={block.id}
                identifier={block.id}
                __typename="dataportal_Digg_Form"
              />
            );
          default:
            return (
              <div key={id}>
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
