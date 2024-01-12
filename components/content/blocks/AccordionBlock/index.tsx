import { FC, useState } from "react";
import { FaqFragment as IFaq } from "@/graphql/__generated__/operations";
import { HtmlParser } from "@/components/global/Typography/HtmlParser";
import CloseIcon from "@/assets/icons/closeCross.svg";
import PlusIcon from "@/assets/icons/plus.svg";

interface AccordionBlockProps extends IFaq {
  idx: number;
}

export const AccordionBlock: FC<AccordionBlockProps> = ({
  question,
  answer,
  idx,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div title={question}>
      <button
        id={`accordion${idx}`}
        className="group inline-flex w-full flex-row items-center justify-between gap-md py-lg text-start"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={`section${idx}`}
      >
        <span className="max-w-[calc(100%-36px)] text-lg underline-offset-4 group-hover:underline">
          {question}
        </span>
        {open ? (
          <CloseIcon className="[&_path]:fill-green-600" />
        ) : (
          <PlusIcon className="[&_path]:fill-green-600" />
        )}
      </button>
      {open && (
        <div
          id={`section${idx}`}
          aria-labelledby={`accordion${idx}`}
          className="space-y-md pb-lg"
        >
          {answer.markdown && HtmlParser({ text: answer.markdown })}
        </div>
      )}
    </div>
  );
};
