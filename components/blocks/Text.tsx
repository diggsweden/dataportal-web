import { Heading } from "@digg/design-system";
import React from "react";
import { TextFragment as IText } from "../../graphql/__generated__/operations";
import { renderMarkdown } from "../Renderers";

export const Text: React.FC<IText> = ({ heading, text }) => {
  return (
    <>
      {heading && (
        <Heading level={2} size={"2xl"} color="white">
          {heading}
        </Heading>
      )}
      <div className="text-md main-text">
        {text.markdown && renderMarkdown(text.markdown)}
      </div>
    </>
  );
};
