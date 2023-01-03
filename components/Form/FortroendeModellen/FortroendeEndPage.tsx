import React, { useEffect } from "react";
import { MainContainerStyle } from "../../../styles/general/emotion";
import { Module_dataportal_Digg_Module } from "../../../graphql/__generated__/Module";
import { ContentArea } from "../../ContentArea";
import { Heading, Container, css, ArrowIcon } from "@digg/design-system";
import { FormBackButton, FormWrapper } from "../Styles/FormStyles";
import { highlightCode } from "../../pages/Articles";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";

export const FortroendeEndPage: React.FC<Module_dataportal_Digg_Module> = ({
  blocks,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    //Highlight code blocks using prismjs
    highlightCode();
  }, []);

  return (
    <Container cssProp={MainContainerStyle}>
      <FormWrapper>
        <FormBackButton
          onClick={(e) => {
            e.preventDefault();
            router.back();
          }}
        >
          <span className="back-button">
            <ArrowIcon color={"white"} width={"18px"} />
            <span className="text-base font-medium back-text">
              {t("pages|form$go-back-text")}
            </span>
          </span>
        </FormBackButton>

        <Heading color="pinkPop" size={"3xl"} weight={"light"}>
          Tack för att du tog dig tid att fylla i formuläret!
        </Heading>

        <ContentArea blocks={blocks} />

        <div className="badge-wrapper">
          <a
            href="https://dataportal.se"
            target="_blank"
            rel="external noopener noreferrer"
          >
            <img
              width="200px"
              src="https://diggdrstoragetest.blob.core.windows.net/strapi-dataportal2-beta/assets/illu_start_2_0_d48c342ac2.svg"
              alt="Fortroendemodellen logo badge"
            />
          </a>
        </div>
      </FormWrapper>
    </Container>
  );
};
