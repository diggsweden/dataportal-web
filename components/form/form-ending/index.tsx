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
      <Preamble color="primary" className="mt-xl text-md">
        {formData.resultPageInfo}
      </Preamble>
      {questionsWithRisks.length > 0 ? (
        <div className="mt-xl rounded-lg bg-brown-100 p-xl">
          <Heading size="sm" className="text-brown-600" level={2}>
            {t("pages|form$risks-title")}
          </Heading>

          <div className="mt-lg space-y-xl">
            {questionsWithRisks.map((item, index) => (
              <div key={index} className="flex flex-col gap-sm">
                <div className="flex items-center gap-sm">
                  <Heading size="xs" className="text-brown-600" level={3}>
                    {item.title}:
                  </Heading>
                  <span className="text-sm text-red-600">{item.answer}</span>
                </div>
                <span className="text-sm text-textPrimary">{item.risk}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
