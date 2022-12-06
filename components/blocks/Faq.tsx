import { Accordion, fontSize, space, css } from '@digg/design-system';
import { useRouter } from 'next/router';
import React from 'react';
import { Faq as IFaq } from '../../graphql/__generated__/Faq';
import { renderMarkdown } from '../Renderers';

export const Faq: React.FC<IFaq> = ({ question, answer }) => {
  const { asPath } = useRouter() || {};
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
