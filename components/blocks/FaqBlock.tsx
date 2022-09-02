import { Accordion, fontSize, space, css } from '@digg/design-system';
import React from 'react';
import { FaqBlock as IFaqBlock } from '../../graphql/__generated__/FaqBlock';
import { renderMarkdown } from '../Renderers';

export const FaqBlock: React.FC<IFaqBlock> = ({ question, answer }) => {
  return (
    <Accordion
      className="dataportal--accordion"
      title={question}
      defaultValue={false}
      unmarkedTitle={question}
    >
      <div
        css={css`
          ${fontSize(['base', 'md'])};
          ${space({ pb: 2 })};
        `}
      >
        {renderMarkdown(answer?.markdown || '')}
      </div>
    </Accordion>
  );
};
