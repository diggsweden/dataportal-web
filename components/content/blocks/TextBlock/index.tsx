import { FC } from "react";
import { TextFragment } from "@/graphql/__generated__/operations";
import { Heading } from "@/components/global/Typography/Heading";
import { HtmlParser } from "@/components/global/Typography/HtmlParser";

export const TextBlock: FC<TextFragment> = ({ heading, text }) => {
  return (
    <div className="textBlock max-w-md space-y-md break-words">
      {heading && (
        <Heading level={2} size={"md"} className="mb-md md:mb-lg">
          {heading}
        </Heading>
      )}

      {text.markdown && HtmlParser({ text: text.markdown })}
    </div>
  );
};
