import React from "react";

import { RelatedContentFragment as IRelatedContent } from "../../graphql/__generated__/operations";
import { Links } from "../Navigation";

interface RelatedContentProps extends IRelatedContent {
  domain?: DiggDomain;
}

export const RelatedContent: React.FC<RelatedContentProps> = ({
  links,
  domain,
}) => {
  return <Links links={links || []} basepath={domain} />;
};
