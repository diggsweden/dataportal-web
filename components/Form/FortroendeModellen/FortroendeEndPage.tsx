import React, { useEffect, useState } from "react";
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
  const [heading, setHeading] = useState<string | null>(null);

  const getHeading = () => {
    if (blocks[0].__typename === "dataportal_Digg_Text") {
      let str = blocks[0].heading;
      blocks[0].heading = null;
      return str;
    } else {
      return null;
    }
  };

  useEffect(() => {
    //Highlight code blocks using prismjs
    highlightCode();
    setHeading(getHeading());
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

        {heading &&(
          <Heading
            color="pinkPop"
            size={"3xl"}
            weight={"light"}
            css={css`
              margin-top: 0;
            `}
          >
            {heading}
          </Heading>
        )}

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
