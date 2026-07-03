import type { FC } from "react";

import { HtmlParser } from "@/components/typography/html-parser";
import type { FaqFragment as IFaq } from "@/graphql/__generated__/operations";
import { AccordionTrigger } from "./accordion-trigger";

interface AccordionBlockProps extends IFaq {
  idx: number;
}

export const AccordionBlock: FC<AccordionBlockProps> = ({
  question,
  answer,
  idx,
}) => {
  return (
    <div title={question}>
      <AccordionTrigger question={question} idx={idx}>
        {answer.markdown && <HtmlParser text={answer.markdown} />}
      </AccordionTrigger>
    </div>
  );
};
