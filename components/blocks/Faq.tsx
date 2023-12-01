import { Accordion, fontSize, space, css } from "@digg/design-system";
import React from "react";
import { FaqFragment as IFaq } from "../../graphql/__generated__/operations";
import { renderMarkdown } from "../Renderers";

export const Faq: React.FC<IFaq> = ({ question, answer }) => {
  return (
    <Accordion
      className="dataportal--accordion"
      title={question}
      defaultValue={false}
      unmarkedTitle={question}
    >
      <div
        css={css`
          ${fontSize(["base", "md"])};
          ${space({ pb: 2 })};
        `}
      >
        {renderMarkdown(answer?.markdown || "")}
      </div>
    </Accordion>
  );
};
