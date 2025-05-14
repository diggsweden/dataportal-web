import useTranslation from "next-translate/useTranslation";
import { FC } from "react";

import { FormData } from "@/components/blocks/fortroendemodellen-v2";
import { Heading } from "@/components/typography/heading";
import { Preamble } from "@/components/typography/preamble";
import { FormTypes } from "@/types/form";

type Props = {
  formDataArray: FormTypes[][];
  formData: FormData;
};

interface QuestionWithRisk {
  title: string;
  risk: string;
  answer: string;
  number: number;
}

export const FormEnding: FC<Props> = ({ formDataArray, formData }) => {
  const { t } = useTranslation();

  const getQuestionsWithRisks = (): QuestionWithRisk[] => {
    const questionsWithRisks: QuestionWithRisk[] = [];

    formDataArray.forEach((page) => {
      page.forEach((item) => {
        if (
          item.__typename === "dataportal_Digg_FormRadio" ||
          item.__typename === "dataportal_Digg_FormCheckbox" ||
          item.__typename === "dataportal_Digg_FormDropdown"
        ) {
          // Handle Radio and Dropdown (single selection)
          if (
            (item.__typename === "dataportal_Digg_FormRadio" ||
              item.__typename === "dataportal_Digg_FormDropdown") &&
            item.selected &&
            typeof item.selected === "object" &&
            "popup" in item.selected &&
            item.selected.popup
          ) {
            questionsWithRisks.push({
              title: item.title,
              risk: item.selected.popup,
              answer: item.selected.label || item.selected.value || "",
              number: item.number,
            });
          }
          // Handle Checkbox (multiple selections)
          else if (
            item.__typename === "dataportal_Digg_FormCheckbox" &&
            Array.isArray(item.selected)
          ) {
            item.selected.forEach((choice) => {
              if (
                choice &&
                typeof choice === "object" &&
                "popup" in choice &&
                choice.popup
              ) {
                questionsWithRisks.push({
                  title: item.title,
                  risk: choice.popup,
                  answer: choice.label,
                  number: item.number,
                });
              }
            });
          }
        }
      });
    });

    return questionsWithRisks;
  };

  const questionsWithRisks = getQuestionsWithRisks();

  return (
    <div>
      <span className="text-lg text-brown-600">{t("pages|form$summary")}</span>
      <Preamble color="primary" className="mt-md text-md lg:mt-xl">
        {formData.resultPageInfo}
      </Preamble>
      <div className="mt-xl rounded-lg bg-brown-100 p-xl">
        {questionsWithRisks.length > 0 ? (
          <div>
            <Heading size="sm" className="text-brown-600" level={2}>
              {t("pages|form$risks-title")}
            </Heading>
            <div className="mt-lg space-y-xl">
              {questionsWithRisks.map((item, index) => (
                <div key={index} className="flex flex-col gap-sm">
                  <Heading size="xs" className="text-brown-600" level={3}>
                    {t("pages|form$question")} {item.number}: {item.title}
                  </Heading>
                  <span className="text-sm">
                    {t("pages|form$answer")} {item.answer}
                  </span>
                  <span className="text-sm text-textPrimary">{item.risk}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Heading size="sm" className="font-strong text-brown-600" level={2}>
            {t("pages|form$no-risk")}
          </Heading>
        )}
      </div>
    </div>
  );
};
