import type { FC } from "react";

import { Heading } from "@/components/typography/heading";
import { HtmlParser } from "@/components/typography/html-parser";
import { type FragmentType, getFragmentData, graphql } from "@/graphql/gql";
import { parseLanguageMarkup } from "@/utilities/check-lang";

export const TextFragment = graphql(`
  fragment Text on dataportal_Digg_Text {
    heading
    text: body {
      markdown
    }
  }
`);

export const TextBlock: FC<{ block: FragmentType<typeof TextFragment> }> = ({
  block,
}) => {
  const { heading, text } = getFragmentData(TextFragment, block);

  return (
    <div className="textBlock max-w-md space-y-md break-words">
      {heading && (
        <Heading level={2} size={"md"} className="mb-md md:mb-lg">
          {parseLanguageMarkup(heading)}
        </Heading>
      )}

      {text.markdown && <HtmlParser text={text.markdown} />}
    </div>
  );
};
