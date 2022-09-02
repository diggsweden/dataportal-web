import { Heading } from '@digg/design-system';
import React from 'react';
import { TextBlock as ITextBlock } from '../../graphql/__generated__/TextBlock';
import { renderMarkdown } from '../Renderers';

export const TextBlock: React.FC<ITextBlock> = ({ heading, text }) => {
  return (
    <>
      {heading && <Heading level={2}>{heading}</Heading>}
      <div className="text-md main-text">{text.markdown && renderMarkdown(text.markdown)}</div>
    </>
  );
};
