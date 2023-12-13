import React from "react";
import { TextFragment as IText } from "../../graphql/__generated__/operations";
import { renderMarkdown } from "../Renderers";

export const Text: React.FC<IText> = ({ heading, text }) => {
  return (
    <>
      {heading && <h2>{heading}</h2>}
      <div className="text-md main-text">
        {/*{text.markdown && renderMarkdown(text.markdown)}*/}
      </div>
    </>
  );
};
