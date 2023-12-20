import React from "react";
import LinksBlock, {
  LinksBlockProps,
} from "@/components/content/Blocks/LinksBlock";

interface RelatedContentProps {
  links: LinksBlockProps[];
}

export const RelatedContent: React.FC<RelatedContentProps> = ({ links }) => {
  return <LinksBlock links={links} inline={true} />;
};
