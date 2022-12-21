import { Heading, css, Container } from "@digg/design-system";
import React from "react";
import { ContentArea, ArticleBlock } from "../..";
import { Containers_dataportal_Digg_Containers_blocks } from "../../../graphql/__generated__/Containers";
import { Module_dataportal_Digg_Module_blocks as Module_blocks } from "../../../graphql/__generated__/Module";
import { Publication_dataportal_Digg_Publications_tags } from "../../../graphql/__generated__/Publication";
import { MainContainerStyle } from "../../../styles/general/emotion";
import { responsive } from "../../../styles/image";
import { PublicationResponse, checkLang } from "../../../utilities";

const whitelistedTagsSV = ["Goda exempel", "Event", "Nyhet"];
export const findPublicationTypeTag = (
  tags: Publication_dataportal_Digg_Publications_tags[]
) => {
  const tag = tags.find((tag) => whitelistedTagsSV.includes(tag.value));
  return tag;
};

const getRelatedHeading = (tag: string) => {
  switch (tag) {
    case "Event":
      return tag.toLowerCase();
    case "Goda exempel":
      return tag.toLowerCase();
    case "Nyhet":
      return "nyheter";
    default:
      return "artiklar";
  }
};

export const Publication: React.FC<PublicationResponse> = ({
  heading,
  preamble,
  tags,
  blocks,
  related,
}) => {
  return (
    <Container cssProp={MainContainerStyle}>
      <div
        css={css`
          position: relative;
          margin-top: 2rem;
        `}
      >
        <div className={"content "}>
          {heading && (
            <Heading size={"3xl"} weight={"light"} color={"pinkPop"}>
              {checkLang(heading)}
            </Heading>
          )}
          <p className="preamble text-lg">{checkLang(preamble)}</p>
          {image && (
            <Image
              src={handleUrl(image)}
              style={responsive}
              width={width || 900}
              height={height || 600}
              alt={alt || ""}
            />
          )}
          {blocks && blocks.length > 0 && (
            <ContentArea
              blocks={
                blocks as (
                  | Containers_dataportal_Digg_Containers_blocks
                  | Module_blocks
                  | null
                )[]
              }
            />
          )}
        </div>
      </div>
      {related && related.length > 0 && (
        <div className="related-content">
          <Heading level={2}>
            Fler{" "}
            {tags &&
              getRelatedHeading(
                findPublicationTypeTag(tags as any[])?.value || ""
              )}
          </Heading>
          <ArticleBlock articles={related} />
        </div>
      )}
    </Container>
  );
};
