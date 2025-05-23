import { usePathname } from "next/navigation";
import useTranslation from "next-translate/useTranslation";
import { FC, useEffect } from "react";

import { FormData } from "@/components/blocks/fortroendemodellen-v2";
import { Heading } from "@/components/typography/heading";
import { Preamble } from "@/components/typography/preamble";
import { FormTypes } from "@/types/form";

type Props = {
  formDataArray: FormTypes[][];
  formData: FormData;
  countQuestionsPerSection: {
    title: string;
    count: number;
    answered: number;
  }[];
};

interface QuestionWithRisk {
  title: string;
  risk: string;
  answer: string;
  number: number;
}

export const FormEnding: FC<Props> = ({
  formDataArray,
  formData,
  countQuestionsPerSection,
}) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  useEffect(() => {
    // Find the name and organization number fields in the form data
    const nameField = formDataArray[0].find(
      (item) =>
        item.__typename === "dataportal_Digg_FormText" &&
        item.title.toLowerCase() === "vad heter ai-systemet?",
    );

    // Track the event with Matomo
    if (window._paq) {
      const name = nameField && "value" in nameField ? nameField.value : "";
      const organisationNumber = localStorage.getItem(`${pathname}OrgNumber`);
      window._paq.push([
        "trackEvent",
        "Förtroendemodellen",
        "AI-systemets namn",
        name,
      ]);
      window._paq.push([
        "trackEvent",
        "Förtroendemodellen",
        "Organisationsnummer",
        organisationNumber,
      ]);
    }
  }, [formDataArray]);

  const questionStats = countQuestionsPerSection.reduce(
    (stats, section) => ({
      total: stats.total + section.count,
      answered: stats.answered + section.answered,
    }),
    { total: 0, answered: 0 },
  );

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
      <Preamble color="primary" className="mb-lg mt-md text-md lg:my-xl">
        {formData.resultPageInfo}
      </Preamble>
      {questionStats.total !== questionStats.answered && (
        <span className="border-brown-800 p-xs text-sm text-red-600 md:border md:p-sm md:text-lg">
          {t("pages|form$not-all-questions-answered")} ({" "}
          {questionStats.total - questionStats.answered}
          {questionStats.total - questionStats.answered === 1
            ? t("pages|form$question-remaining")
            : t("pages|form$questions-remaining")}{" "}
          )
        </span>
      )}
      <div className="mt-xl rounded-lg bg-brown-100 p-xl">
        {questionsWithRisks.length > 0 ? (
          <div>
            <Heading size="sm" className="text-brown-600" level={2}>
              {t("pages|form$risks-title")}
            </Heading>
            <div className="mt-lg space-y-xl">
              {questionsWithRisks.map((item, index) => (
                <div key={index} className="flex flex-col gap-sm">
                  <Heading size="sm" className="text-brown-600" level={3}>
                    {t("pages|form$question")} {item.number}
                  </Heading>
                  <span>{item.title}</span>
                  <span className="w-fit border border-brown-600 p-sm text-sm">
                    {t("pages|form$answer")} {item.answer}
                  </span>
                  <span className="text-sm text-brown-600">{item.risk}</span>
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
