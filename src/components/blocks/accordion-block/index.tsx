import type { FC } from "react";

import { HtmlParser } from "@/components/typography/html-parser";
import { type FragmentType, getFragmentData, graphql } from "@/graphql/gql";
import { AccordionTrigger } from "./accordion-trigger";

export const FaqFragment = graphql(`
  fragment Faq on dataportal_Digg_Faq {
    question
    answer {
      markdown
    }
  }
`);

interface AccordionBlockProps {
  block: FragmentType<typeof FaqFragment>;
  idx: number;
}

export const AccordionBlock: FC<AccordionBlockProps> = ({ block, idx }) => {
  const { question, answer } = getFragmentData(FaqFragment, block);

  return (
    <div title={question}>
      <AccordionTrigger question={question} idx={idx}>
        {answer.markdown && <HtmlParser text={answer.markdown} />}
      </AccordionTrigger>
    </div>
  );
};
