import { css, Heading } from '@digg/design-system';
import React from 'react';
import {
  Containers_dataportal_Digg_Containers_blocks,
  Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList,
  Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Faq as FAQ,
} from '../../graphql/__generated__/Containers';
import { RelatedContent as IRelatedContent } from '../../graphql/__generated__/RelatedContent';
import { Module_dataportal_Digg_Module_blocks as Module_blocks } from '../../graphql/__generated__/Module';
import { Faq, RelatedContent, Media, Text, Form } from '../blocks';
import Modules from './Modules';

interface ContentAreaProps {
  blocks: (Containers_dataportal_Digg_Containers_blocks | Module_blocks | null)[];
}

/**
 * Finds grouped accordions and returns them
 * @param blocks all blocks from the content area
 * @param pos the position of the FAQ
 * @returns FaqBlocks wrapped in <dl> element
 */
const handleFaqs = (
  blocks: (Containers_dataportal_Digg_Containers_blocks | Module_blocks | null)[],
  pos: number
) => {
  // skip rendering if previous block was FAQ
  // because then in should already be rendered
  const previousBlock = blocks[pos - 1];
  if (previousBlock?.__typename === 'dataportal_Digg_Faq') return;

  let i = 0;
  // count the number of FAQs to render from the given position
  while (blocks[pos + i]?.__typename === 'dataportal_Digg_Faq' || i > 500) {
    i++;
  }

  // make a copy of the FAQ range to render
  const faqGroup = (blocks as FAQ[]).slice(pos, pos + i);

  return (
    <dl
      className="faqblock"
      key={`content-${pos}-${faqGroup[0].id}`}
    >
      {faqGroup.map((faq) => (
        <Faq
          {...faq}
          key={faq?.id}
        />
      ))}
    </dl>
  );
};

export const ContentArea: React.FC<ContentAreaProps> = ({ blocks }) => {
  return (
    <>
      {blocks?.map((block, index) => {
        const { id } = block || {};
        switch (block?.__typename) {
          case 'dataportal_Digg_Text':
            return (
              <Text
                {...block}
                key={id}
              />
            );
          case 'dataportal_Digg_Media':
            return (
              <Media
                {...block}
                key={id}
              />
            );
          case 'dataportal_Digg_Faq':
            return handleFaqs(blocks, index);
          // ? we handle HeroBlock in _app.tsx
          case 'dataportal_Digg_Hero':
            return;
          case 'dataportal_Digg_RelatedContent':
            return (
              <RelatedContent
                {...(block as IRelatedContent)}
                key={id}
              />
            );
          case 'dataportal_Digg_ModuleList':
            const typedBlock =
              block as Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList;
            return (
              typedBlock.modules &&
              typedBlock.modules.map((module) => (
                <Modules
                  {...module}
                  key={module.identifier}
                />
              ))
            );
          case 'dataportal_Digg_FormBlock':
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
                <Heading
                  level={2}
                  lang="en"
                >
                  <>{(block as any)?.__typename} Not found</>
                </Heading>
                <pre
                  css={css`
                    overflow: auto;
                  `}
                >
                  {JSON.stringify(block, null, 2)}
                </pre>
              </div>
            );
        }
      })}
    </>
  );
};

export default ContentArea;
