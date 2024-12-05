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
        className="group inline-flex w-full flex-row items-center justify-between gap-md py-lg text-start"
        onClick={() => setOpen(!open)}
        aria-label={
          open
            ? `${t("common|close")} FAQ ${question}`
            : `${t("common|open")} FAQ ${question}`
        }
        aria-expanded={open}
        aria-controls={`section-${idx}`}
      >
        <span className="max-w-[calc(100%-36px)] text-lg underline-offset-4 group-hover:underline">
          {question}
        </span>
        {open ? (
          <CrossIcon
            width={iconSize * 1.5}
            height={iconSize * 1.5}
            viewBox="0 0 24 24"
            className="[&_path]:fill-green-600"
          />
        ) : (
          <PlusIcon
            width={iconSize * 1.5}
            height={iconSize * 1.5}
            viewBox="0 0 24 24"
            className="[&_path]:fill-green-600"
          />
        )}
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
