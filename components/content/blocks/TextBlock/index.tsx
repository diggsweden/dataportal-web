import { FC } from "react";
import { TextFragment as IText } from "@/graphql/__generated__/operations";
import Heading from "@/components/global/Typography/Heading";
import { HtmlParser } from "@/components/global/Typography/HtmlParser";

const TextBlock: FC<IText> = ({ heading, text }) => {
  return (
    <div className="max-w-md space-y-md">
      {heading && (
        <Heading level={2} size={"md"}>
          {heading}
        </Heading>
      )}
      <div className="space-y-md">
        {text.markdown && HtmlParser({ text: text.markdown })}
      </div>
    </div>
  );
};

export default TextBlock;
