import { colorPalette, QuoteIcon } from '@digg/design-system';
import React from 'react';

interface IQuoteBlock {
  children?: React.ReactNode;
}

export const QuoteBlock: React.FC<IQuoteBlock> = ({ children }) => {
  return (
    <div className="quoteblock">
      <span className="icon">
        <QuoteIcon
          width={32}
          color={colorPalette.green700}
        />
      </span>
      <blockquote>{children}</blockquote>
    </div>
  );
};
