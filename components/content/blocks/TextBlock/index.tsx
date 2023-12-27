import { FC } from "react";
import { TextFragment as IText } from "@/graphql/__generated__/operations";
import Heading from "@/components/global/Typography/Heading";
import { HtmlParser } from "@/components/global/Typography/HtmlParser";

const TextBlock: FC<IText> = ({ heading, text }) => {
  return (
    <>
      {heading && (
        <Heading level={2} size={"md"}>
          {heading}
        </Heading>
      )}

      {text.markdown && HtmlParser({ text: text.markdown })}
    </>
  );
};

export default TextBlock;
