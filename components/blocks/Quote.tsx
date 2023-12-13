import React from "react";

interface IQuoteBlock {
  children?: React.ReactNode;
}

export const Quote: React.FC<IQuoteBlock> = ({ children }) => {
  return (
    <div className="quoteblock">
      <span className="icon"></span>
      <blockquote>{children}</blockquote>
    </div>
  );
};
