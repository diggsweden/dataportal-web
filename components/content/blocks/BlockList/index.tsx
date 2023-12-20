import React from "react";
import {
  ContainerData_Dataportal_Digg_Container_Fragment,
  ModuleListDataFragment,
  FaqFragment,
} from "@/graphql/__generated__/operations";
import { ModuleDataFragment } from "@/graphql/__generated__/operations";
import { Faq, Media, Text, Form } from "@/components/blocks";
import RelatedContentBlock from "@/components/content/blocks/RelatedContentBlock";

interface blockListProps {
  blocks:
    | ContainerData_Dataportal_Digg_Container_Fragment["blocks"]
    | ModuleDataFragment["blocks"];
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
    <dl className="faqblock" key={`content-${pos}-${faqGroup[0].id}`}>
      {faqGroup.map((faq) => (
        <Faq {...(faq as FaqFragment)} key={faq?.id} />
      ))}
    </dl>
  );
};

export const BlockList: React.FC<blockListProps> = ({ blocks }) => {
  return (
    <>
      {blocks?.map((block, index) => {
        if (block == null) {
          return;
        }
        const { id } = block || {};
        switch (block.__typename) {
          case "dataportal_Digg_Text":
            return <Text {...block} key={id} />;
          case "dataportal_Digg_Media":
            return <Media {...block} key={id} />;
          case "dataportal_Digg_Faq":
            return handleFaqs(blocks, index);
          case "dataportal_Digg_RelatedContent":
            return <RelatedContentBlock {...block} key={id} inline={true} />;
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
              <Form
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
    </>
  );
};

export default BlockList;
