import { FC } from "react";

import { Heading } from "@/components/typography/heading";
import { HtmlParser } from "@/components/typography/html-parser";
import { TextFragment } from "@/graphql/__generated__/operations";
import { parseLanguageMarkup } from "@/utilities/check-lang";

export const TextBlock: FC<TextFragment> = ({ heading, text }) => {
  return (
    <div className="textBlock max-w-md space-y-md break-words">
      {heading && (
        <Heading level={2} size={"md"} className="mb-md md:mb-lg">
          {parseLanguageMarkup(heading)}
        </Heading>
      )}

      {text.markdown && HtmlParser({ text: text.markdown })}
    </div>
  );
};
