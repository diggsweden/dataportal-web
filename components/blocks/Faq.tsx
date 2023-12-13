import React from "react";
import { FaqFragment as IFaq } from "../../graphql/__generated__/operations";
import { renderMarkdown } from "../Renderers";

export const Faq: React.FC<IFaq> = ({ question, answer }) => {
  return (
    <div className="dataportal--accordion" title={question}>
      <div>{/*{renderMarkdown(answer?.markdown || "")}*/}</div>
    </div>
  );
};
