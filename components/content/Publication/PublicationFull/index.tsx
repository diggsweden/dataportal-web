import React from "react";
import BlockList from "@/components/content/blocks/BlockList";
import { PublicationResponse } from "@/utilities";
import Container from "@/components/layout/Container";
import { PublicationList } from "@/components/content/Publication/PublicationList";
import { Hero } from "@/components/layout/Hero";

const whitelistedTagsSV = ["Goda exempel", "Event", "Nyhet"];
export const findPublicationTypeTag = (tags: PublicationResponse["tags"]) => {
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

export const PublicationFull: React.FC<PublicationResponse> = ({
  heading,
  preamble,
  image,
  tags,
  blocks,
  related,
}) => {
  let relatedHeading =
    "Fler " + getRelatedHeading(findPublicationTypeTag(tags)?.value || "");
  return (
    <div>
      <Hero heading={heading} preamble={preamble} image={image}></Hero>
      <Container className="ml-0" position="left">
        {blocks && blocks.length > 0 && <BlockList blocks={blocks} />}
        {related && related.length > 0 && (
          <PublicationList publications={related} heading={relatedHeading} />
        )}
      </Container>
    </div>
  );
};
