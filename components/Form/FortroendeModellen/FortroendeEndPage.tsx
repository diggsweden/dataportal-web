import React, { useEffect, useState } from "react";
import { MainContainerStyle } from "../../../styles/general/emotion";
import { ModuleDataFragment } from "../../../graphql/__generated__/operations";
import { ArrowIcon, Container, css, Heading } from "@digg/design-system";
import { FormBackButton, FormWrapper } from "../Styles/FormStyles";
import { highlightCode } from "../../pages/Articles";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import fortroendeLogo from "@/public/images/förtroendemodell-logo.svg";
import Image from "next/image";
import BlockList from "@/components/content/blocks/BlockList";

export const FortroendeEndPage: React.FC<ModuleDataFragment> = ({ blocks }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [heading, setHeading] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const getHeading = () => {
    if (blocks[0].__typename === "dataportal_Digg_Text") {
      let str = blocks[0].heading;
      blocks[0].heading = null;
      return str;
    } else {
      return null;
    }
  };

  const getImageUrl = () => {
    const textToCheck =
      blocks[1].__typename === "dataportal_Digg_Text"
        ? blocks[1].text.markdown
        : null;
    if (textToCheck === null) return;

    const regex = /src="([^"]*)"/g; //Check for src=" "
    const found = textToCheck.match(regex);
    const imageUrl = found
      ? found[0].replace('src="', "").replace('"', "")
      : "";
    setImageUrl(imageUrl);
  };

  useEffect(() => {
    //Highlight code blocks using prismjs
    getImageUrl();

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
            <span className="text-base back-text font-medium">
              {t("pages|form$go-back-text")}
            </span>
          </span>
        </FormBackButton>

        {heading && (
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

        <BlockList blocks={blocks} />

        <div className="badge-wrapper">
          <a
            href="https://dataportal.se"
            target="_blank"
            rel="external noopener noreferrer"
            title="Fortroendemodellen logo badge"
          >
            <Image
              width="200"
              height={"200"}
              src={imageUrl ? imageUrl : fortroendeLogo}
              alt="Förtroendemodellen logo badge"
            />
          </a>
        </div>
      </FormWrapper>
    </Container>
  );
};
