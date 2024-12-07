import useTranslation from "next-translate/useTranslation";
import { FC, useContext, useState } from "react";

import CrossIcon from "@/assets/icons/cross.svg";
import PlusIcon from "@/assets/icons/plus.svg";
import { HtmlParser } from "@/components/typography/html-parser";
import { FaqFragment as IFaq } from "@/graphql/__generated__/operations";
import { SettingsContext } from "@/providers/settings-provider";

interface AccordionBlockProps extends IFaq {
  idx: number;
}

export const AccordionBlock: FC<AccordionBlockProps> = ({
  question,
  answer,
  idx,
}) => {
  const { t } = useTranslation();
  const { iconSize } = useContext(SettingsContext);
  const [open, setOpen] = useState(false);

  return (
    <div title={question}>
      <button
        id={`accordion-${idx}`}
        className="group inline-flex w-full flex-row items-center justify-between gap-md hyphens-auto py-lg text-start"
        onClick={() => setOpen(!open)}
        aria-label={
          open
            ? `${t("common|close")} FAQ ${question}`
            : `${t("common|open")} FAQ ${question}`
        }
        aria-expanded={open}
        aria-controls={`section-${idx}`}
      >
        <span className="text-lg underline-offset-4 group-hover:underline">
          {question}
        </span>
        <span className="flex-shrink-0 text-green-600">
          {open ? (
            <CrossIcon width={iconSize * 1.5} height={iconSize * 1.5} />
          ) : (
            <PlusIcon width={iconSize * 1.5} height={iconSize * 1.5} />
          )}
        </span>
      </button>
      {open && (
        <div
          id={`section-${idx}`}
          role="region"
          aria-labelledby={`accordion-${idx}`}
          className="space-y-md pb-lg"
        >
          {answer.markdown && HtmlParser({ text: answer.markdown })}
        </div>
      )}
    </div>
  );
};
