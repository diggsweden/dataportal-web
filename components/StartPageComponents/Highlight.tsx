import useTranslation from "next-translate/useTranslation";
import React from "react";
import {
  Illustration_1,
  Illustration_2,
  Illustration_3,
} from "../Illustrations";

export const Highlight: React.FC = () => {
  const { t } = useTranslation("pages");
  return (
    <div>
      <div className="highlight">
        <div className="highlight__illustraitons">
          <div className="illustration-container">
            <Illustration_1 />
          </div>
          <div className="illustration-container">
            <Illustration_2 />
          </div>
          <div className="illustration-container">
            <Illustration_3 />
          </div>
        </div>
        <div className="highlight__txt">
          <h2>{t("highlight$highlight-header")}</h2>
          <p className="text-md">{t("highlight$highlight-text")}</p>
        </div>
      </div>
    </div>
  );
};
