import { FC, useState } from "react";
import { FaqFragment as IFaq } from "@/graphql/__generated__/operations";
import { HtmlParser } from "@/components/global/Typography/HtmlParser";
import CloseIcon from "@/assets/icons/closeCross.svg";
import PlusIcon from "@/assets/icons/plus.svg";

export const AccordionBlock: FC<IFaq> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="" title={question}>
      <button
        className="group inline-flex w-full flex-row items-center justify-between gap-md py-lg"
        onClick={() => setOpen(!open)}
      >
        <span className="text-lg underline-offset-4 group-hover:underline">
          {question}
        </span>
        {open ? (
          <CloseIcon className="[&_path]:fill-green-600" />
        ) : (
          <PlusIcon className="[&_path]:fill-green-600" />
        )}
      </button>
      {open && (
        <div className="space-y-md pb-lg">
          {answer.markdown && HtmlParser({ text: answer.markdown })}
        </div>
      )}
    </div>
  );
};
