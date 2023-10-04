import { Heading, css, Container } from "@digg/design-system";
import React from "react";
import { ContentArea, ArticleBlock } from "../..";
import { MainContainerStyle } from "../../../styles/general/emotion";
import { PublicationResponse, checkLang } from "../../../utilities";

const whitelistedTagsSV = ["Goda exempel", "Event", "Nyhet"];
export const findPublicationTypeTag = (
  tags: PublicationResponse["tags"]
) => {
  return tags.find((tag) => whitelistedTagsSV.includes(tag.value));
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
          {blocks && blocks.length > 0 && (
            <ContentArea
              blocks={
                blocks
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
                findPublicationTypeTag(tags)?.value || ""
              )}
          </Heading>
          <ArticleBlock articles={related} />
        </div>
      )}
    </Container>
  );
};
